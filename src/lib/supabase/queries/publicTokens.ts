import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase/types";

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
 * none exists, mints one inline and returns it.
 *
 * The "lazy auto-create" is intentional: the first time a rider opens the
 * QR tab is the right moment to materialise the token — until then there
 * is no reason for the row to exist. RLS already restricts inserts to the
 * caller's own user_id, so the client can do this safely.
 *
 * Two concurrent invocations on the same client are deduped by React
 * Query's queryKey machinery (single in-flight per key). Two concurrent
 * devices for the same user could in principle each create one row; both
 * remain valid QR targets until revoked, so the only impact is two extra
 * rows in public_tokens. Not a security issue.
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
      if (existing.data) {
        if (!isExpired(existing.data)) return existing.data;
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
    // time means we don't refetch on every tab focus — rotation already
    // invalidates the key explicitly.
    staleTime: 5 * 60_000,
  });
}

/**
 * Atomic-from-the-caller revoke + mint. Marks every active row for this
 * user as revoked and inserts a fresh one, then optimistically writes the
 * new row into the cache so the QR display swaps without a flicker.
 *
 * Two-step UI (confirmation modal) lives in src/features/qr — this hook
 * does not warn or confirm.
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

function isExpired(row: PublicTokenRow): boolean {
  if (!row.expires_at) return false;
  return new Date(row.expires_at).getTime() < Date.now();
}

export type { PublicTokenRow };
