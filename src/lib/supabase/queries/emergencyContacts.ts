import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase/types";

type ContactRow = Database["public"]["Tables"]["emergency_contacts"]["Row"];
type ContactInsert = Database["public"]["Tables"]["emergency_contacts"]["Insert"];
type ContactUpdate = Database["public"]["Tables"]["emergency_contacts"]["Update"];

/**
 * Query-key factory for emergency contacts. Always use these — never inline arrays.
 */
export const contactKeys = {
  all: ["emergency_contacts"] as const,
  list: (userId: string) => [...contactKeys.all, userId] as const,
};

/**
 * Lists the calling user's emergency contacts ordered by:
 *   1. priority ASC (0 first — added in migration 0002)
 *   2. created_at ASC (stable tiebreaker)
 *
 * RLS restricts to user's own rows; passing another user_id returns [].
 */
export function useContacts(userId: string | undefined): UseQueryResult<ContactRow[]> {
  return useQuery({
    queryKey: contactKeys.list(userId ?? "anonymous"),
    queryFn: async () => {
      if (!userId) throw new Error("useContacts: userId is required");
      const { data, error } = await supabase
        .from("emergency_contacts")
        .select("*")
        .eq("user_id", userId)
        .order("priority", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    staleTime: 60_000,
  });
}

/**
 * Inserts a new contact. priority defaults to current list length so new
 * contacts append to the bottom of the visible order.
 *
 * Optimistic: appends a placeholder row with a synthetic id; on settle the
 * cache is invalidated so the real id from Supabase replaces it.
 */
export function useAddContact(
  userId: string,
): UseMutationResult<
  ContactRow,
  Error,
  Omit<ContactInsert, "user_id" | "id" | "created_at" | "priority">,
  { previous: ContactRow[] | undefined }
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      const previous = qc.getQueryData<ContactRow[]>(contactKeys.list(userId)) ?? [];
      const insert: ContactInsert = {
        ...input,
        user_id: userId,
        priority: previous.length,
      };
      const { data, error } = await supabase
        .from("emergency_contacts")
        .insert(insert)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onMutate: async (input) => {
      const key = contactKeys.list(userId);
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<ContactRow[]>(key);
      const optimistic: ContactRow = {
        id: `optimistic-${Date.now()}`,
        user_id: userId,
        name: input.name,
        phone: input.phone,
        relation: input.relation ?? null,
        priority: (previous?.length ?? 0),
        created_at: new Date().toISOString(),
      };
      qc.setQueryData<ContactRow[]>(key, [...(previous ?? []), optimistic]);
      return { previous };
    },
    onError: (_err, _input, ctx) => {
      if (ctx?.previous) qc.setQueryData(contactKeys.list(userId), ctx.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: contactKeys.list(userId) });
    },
  });
}

/**
 * Updates an existing contact. Optimistic in-place replace.
 */
export function useUpdateContact(
  userId: string,
): UseMutationResult<
  ContactRow,
  Error,
  { id: string; patch: ContactUpdate },
  { previous: ContactRow[] | undefined }
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch }) => {
      const { data, error } = await supabase
        .from("emergency_contacts")
        .update(patch)
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onMutate: async ({ id, patch }) => {
      const key = contactKeys.list(userId);
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<ContactRow[]>(key);
      if (previous) {
        qc.setQueryData<ContactRow[]>(
          key,
          previous.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        );
      }
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(contactKeys.list(userId), ctx.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: contactKeys.list(userId) });
    },
  });
}

/**
 * Deletes a contact. Optimistic removal from the cached list.
 *
 * Note: leaves a priority gap (e.g. [0,2,3] after deleting priority=1). The
 * displayed order is still correct (sort by priority); densifying would
 * require a follow-up reorder, which we leave to the user to trigger
 * explicitly. Phase 2 may auto-densify on delete if user research asks.
 */
export function useDeleteContact(
  userId: string,
): UseMutationResult<void, Error, string, { previous: ContactRow[] | undefined }> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("emergency_contacts")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onMutate: async (id) => {
      const key = contactKeys.list(userId);
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<ContactRow[]>(key);
      if (previous) {
        qc.setQueryData<ContactRow[]>(key, previous.filter((c) => c.id !== id));
      }
      return { previous };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(contactKeys.list(userId), ctx.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: contactKeys.list(userId) });
    },
  });
}

/**
 * Bulk-sets priorities so the given id order becomes priorities 0..N-1.
 * Used by the up/down move buttons in the list — the caller computes the
 * new id order and we apply it densely.
 *
 * Implementation: one Supabase UPDATE per row, fired in parallel. For the
 * realistic 3–8-contact case this is a handful of fast round-trips; for a
 * much larger list we'd add an `rpc('set_contact_priorities', ids)` SQL
 * function. Not warranted yet.
 *
 * Optimistic: reorders the cached list immediately.
 */
export function useReorderContacts(
  userId: string,
): UseMutationResult<void, Error, string[], { previous: ContactRow[] | undefined }> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (orderedIds) => {
      await Promise.all(
        orderedIds.map((id, index) =>
          supabase
            .from("emergency_contacts")
            .update({ priority: index })
            .eq("id", id)
            .eq("user_id", userId)
            .then(({ error }) => {
              if (error) throw error;
            }),
        ),
      );
    },
    onMutate: async (orderedIds) => {
      const key = contactKeys.list(userId);
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<ContactRow[]>(key);
      if (previous) {
        const byId = new Map(previous.map((c) => [c.id, c] as const));
        const reordered = orderedIds
          .map((id, index) => {
            const c = byId.get(id);
            return c ? { ...c, priority: index } : null;
          })
          .filter((c): c is ContactRow => c !== null);
        qc.setQueryData<ContactRow[]>(key, reordered);
      }
      return { previous };
    },
    onError: (_err, _ids, ctx) => {
      if (ctx?.previous) qc.setQueryData(contactKeys.list(userId), ctx.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: contactKeys.list(userId) });
    },
  });
}

export type { ContactRow, ContactInsert, ContactUpdate };
