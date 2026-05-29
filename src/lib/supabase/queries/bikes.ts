import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase/types";

type BikeRow = Database["public"]["Tables"]["bikes"]["Row"];
type BikeInsert = Database["public"]["Tables"]["bikes"]["Insert"];
type BikeUpdate = Database["public"]["Tables"]["bikes"]["Update"];

/**
 * Query-key factory for bikes. Always use these.
 */
export const bikeKeys = {
  all: ["bikes"] as const,
  list: (userId: string) => [...bikeKeys.all, userId] as const,
};

/**
 * Lists the calling user's bikes, primary first then by created_at ASC.
 * Matches the lockscreen-snapshot expectation that there's at most one primary.
 */
export function useBikes(userId: string | undefined): UseQueryResult<BikeRow[]> {
  return useQuery({
    queryKey: bikeKeys.list(userId ?? "anonymous"),
    queryFn: async () => {
      if (!userId) throw new Error("useBikes: userId is required");
      const { data, error } = await supabase
        .from("bikes")
        .select("*")
        .eq("user_id", userId)
        .order("is_primary", { ascending: false })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: 60_000,
  });
}

type AddBikeInput = Omit<BikeInsert, "user_id" | "id" | "created_at">;

/**
 * Inserts a bike. is_primary defaults to false unless the user sets it; if
 * they ask for a new primary we still need to demote-then-promote at the app
 * layer (see useSetPrimaryBike) — the form path uses useAddBike for new rows
 * and only sets is_primary=true if no current primary exists.
 */
export function useAddBike(
  userId: string,
): UseMutationResult<BikeRow, Error, AddBikeInput, { previous: BikeRow[] | undefined }> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      const insert: BikeInsert = { ...input, user_id: userId };
      const { data, error } = await supabase
        .from("bikes")
        .insert(insert)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onMutate: async (input) => {
      const key = bikeKeys.list(userId);
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<BikeRow[]>(key);
      const optimistic: BikeRow = {
        id: `optimistic-${Date.now()}`,
        user_id: userId,
        make: input.make ?? "",
        model: input.model ?? "",
        year: input.year ?? null,
        license_plate: input.license_plate ?? null,
        is_primary: input.is_primary ?? false,
        created_at: new Date().toISOString(),
      };
      qc.setQueryData<BikeRow[]>(key, [...(previous ?? []), optimistic]);
      return { previous };
    },
    onError: (_err, _input, ctx) => {
      if (ctx?.previous) qc.setQueryData(bikeKeys.list(userId), ctx.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: bikeKeys.list(userId) });
    },
  });
}

/**
 * Updates an existing bike (any fields except is_primary — promotion goes
 * through useSetPrimaryBike so the demote-then-promote invariant from
 * migration 0002 is enforced at the app layer).
 */
export function useUpdateBike(
  userId: string,
): UseMutationResult<
  BikeRow,
  Error,
  { id: string; patch: Omit<BikeUpdate, "is_primary"> },
  { previous: BikeRow[] | undefined }
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }) => {
      const { data, error } = await supabase
        .from("bikes")
        .update(patch)
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onMutate: async ({ id, patch }) => {
      const key = bikeKeys.list(userId);
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<BikeRow[]>(key);
      if (previous) {
        qc.setQueryData<BikeRow[]>(
          key,
          previous.map((b) => (b.id === id ? { ...b, ...patch } : b)),
        );
      }
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(bikeKeys.list(userId), ctx.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: bikeKeys.list(userId) });
    },
  });
}

/**
 * Promotes a bike to primary, demoting the current primary first.
 *
 * Demote-then-promote ordering matters: migration 0002's partial unique index
 * (`WHERE is_primary = true`) is checked row-by-row at write time. Promoting
 * first momentarily has two primaries for the same user → unique violation.
 * Two sequential UPDATEs (demote, then promote) make the intermediate state
 * zero-primary, which doesn't violate the constraint.
 *
 * For the unset-primary case (user clears the star without picking a new
 * bike), pass `null` and we just demote.
 *
 * Optimistic update: cache reflects the new primary instantly; rollback on error.
 */
export function useSetPrimaryBike(
  userId: string,
): UseMutationResult<void, Error, string | null, { previous: BikeRow[] | undefined }> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (newPrimaryId) => {
      // Step 1 — demote any current primary owned by this user. Idempotent.
      const { error: demoteErr } = await supabase
        .from("bikes")
        .update({ is_primary: false })
        .eq("user_id", userId)
        .eq("is_primary", true);
      if (demoteErr) throw demoteErr;
      if (newPrimaryId === null) return;
      // Step 2 — promote the requested bike.
      const { error: promoteErr } = await supabase
        .from("bikes")
        .update({ is_primary: true })
        .eq("id", newPrimaryId)
        .eq("user_id", userId);
      if (promoteErr) throw promoteErr;
    },
    onMutate: async (newPrimaryId) => {
      const key = bikeKeys.list(userId);
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<BikeRow[]>(key);
      if (previous) {
        qc.setQueryData<BikeRow[]>(
          key,
          previous.map((b) => ({ ...b, is_primary: b.id === newPrimaryId })),
        );
      }
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(bikeKeys.list(userId), ctx.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: bikeKeys.list(userId) });
    },
  });
}

/**
 * Deletes a bike. Optimistic removal.
 *
 * Edge case: deleting the primary leaves the user with no primary bike.
 * Acceptable — the snapshot just omits the primary_bike field. The user can
 * promote another via the per-card "set primary" affordance.
 */
export function useDeleteBike(
  userId: string,
): UseMutationResult<void, Error, string, { previous: BikeRow[] | undefined }> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("bikes")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onMutate: async (id) => {
      const key = bikeKeys.list(userId);
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<BikeRow[]>(key);
      if (previous) {
        qc.setQueryData<BikeRow[]>(key, previous.filter((b) => b.id !== id));
      }
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(bikeKeys.list(userId), ctx.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: bikeKeys.list(userId) });
    },
  });
}

export type { BikeRow, BikeInsert, BikeUpdate, AddBikeInput };
