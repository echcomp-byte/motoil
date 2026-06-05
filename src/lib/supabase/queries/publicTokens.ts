import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase/types";
import { computeExpiresAt, isExpired, type ExpiryPreset } from "@/features/qr/expiry";

type PublicTokenRow = Database["public"]["Tables"]["public_tokens"]["Row"];

/**
 * Query-key factory. Mirrors the profileKeys shape so cache lookups stay
 * consistent across features. Never inline a queryKey array — always go
 * through this factory.
 */
export const publicTokenKeys = {
  all: ["publicTokens"] as const,
  active: (userId: string) => [...publicTokenKeys.all, "active", userId] as const,
};

/**
 * Returns the user's active (non-revoked, non-expired) public token. If
 * none exists, mints one inline and returns it. If the latest active
 * row has expired, revokes it and mints a fresh one in the same call
 * (silent auto-rotation per PM decision 2026-06-01).
 *
 * The "lazy auto-create" is intentional: the first time a rider opens
 * the QR tab is the right moment to materialise the token — until then
 * there is no reason for the row to exist. RLS already restricts
 * inserts to the caller's own user_id, so the client can do this
 * safely.
 *
 * Two concurrent invocations on the same client are deduped by React
 * Query's queryKey machinery (single in-flight per key). Two concurrent
 * devices for the same user could each create one row; both remain
 * valid QR targets until revoked, so the only impact is two extra rows
 * in public_tokens. Not a security issue.
 */
export function usePublicToken(
  userId: string | undefined,
): UseQueryResult<PublicTokenRow> {
  return useQuery({
    queryKey: publicTokenKeys.active(userId ?? "anonymous"),
    queryFn: async () => {
      if (!userId) throw new Error("usePublicToken: userId is required");
      const existing = await supabase
        .from("public_tokens")
        .select("*")
        .eq("user_id", userId)
        .is("revoked_at", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (existing.error) throw existing.error;
      if (existing.data && !isExpired(existing.data.expires_at)) {
        return existing.data;
      }
      // Either no active row, or the active row has expired. If expired,
      // mark every active-but-past-expiry row revoked so the table stays
      // clean — otherwise expired rows would accumulate with NULL
      // revoked_at and confuse anyone running the cleanup query.
      if (existing.data && isExpired(existing.data.expires_at)) {
        const revoke = await supabase
          .from("public_tokens")
          .update({ revoked_at: new Date().toISOString() })
          .eq("user_id", userId)
          .is("revoked_at", null)
          .lt("expires_at", new Date().toISOString());
        if (revoke.error) throw revoke.error;
      }
      const created = await supabase
        .from("public_tokens")
        .insert({ user_id: userId })
        .select()
        .single();
      if (created.error) throw created.error;
      return created.data;
    },
    enabled: !!userId,
    // Tokens are basically immutable until the user rotates. Long stale
    // time means we don't refetch on every tab focus — rotation
    // already invalidates the key explicitly.
    staleTime: 5 * 60_000,
  });
}

/**
 * Atomic-from-the-caller revoke + mint. Marks every active row for
 * this user as revoked and inserts a fresh one, then optimistically
 * writes the new row into the cache so the QR display swaps without a
 * flicker.
 *
 * Two-step UI (confirmation modal) lives in src/features/qr — this
 * hook does not warn or confirm.
 */
export function useRotatePublicToken(
  userId: string,
): UseMutationResult<PublicTokenRow, Error, void, { previous: PublicTokenRow | undefined }> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const now = new Date().toISOString();
      const revoked = await supabase
        .from("public_tokens")
        .update({ revoked_at: now })
        .eq("user_id", userId)
        .is("revoked_at", null);
      if (revoked.error) throw revoked.error;
      const created = await supabase
        .from("public_tokens")
        .insert({ user_id: userId })
        .select()
        .single();
      if (created.error) throw created.error;
      return created.data;
    },
    onMutate: async () => {
      const key = publicTokenKeys.active(userId);
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<PublicTokenRow>(key);
      return { previous };
    },
    onSuccess: (newToken) => {
      qc.setQueryData(publicTokenKeys.active(userId), newToken);
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(publicTokenKeys.active(userId), ctx.previous);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: publicTokenKeys.active(userId) });
    },
  });
}

/**
 * Sets the expiry on every active row for this user. Applies to all
 * (not just the most-recent) so that tokens minted on a second device
 * share the same lifetime — otherwise a stale device's QR would outlive
 * what the user just dialled in. The cache update picks the latest
 * row's freshly-set expiry as the canonical value.
 *
 * Caller supplies an ExpiryPreset; the date math lives in
 * src/features/qr/expiry.ts.
 */
export function useSetTokenExpiry(
  userId: string,
): UseMutationResult<PublicTokenRow | null, Error, ExpiryPreset, { previous: PublicTokenRow | undefined }> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (preset) => {
      const expiresAt = computeExpiresAt(preset);
      const { data, error } = await supabase
        .from("public_tokens")
        .update({ expires_at: expiresAt })
        .eq("user_id", userId)
        .is("revoked_at", null)
        .select()
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data?.[0] ?? null;
    },
    onMutate: async () => {
      const key = publicTokenKeys.active(userId);
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<PublicTokenRow>(key);
      return { previous };
    },
    onSuccess: (row) => {
      if (row) qc.setQueryData(publicTokenKeys.active(userId), row);
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(publicTokenKeys.active(userId), ctx.previous);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: publicTokenKeys.active(userId) });
    },
  });
}

export type { PublicTokenRow };
