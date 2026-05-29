import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/supabase/types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

/**
 * Query-key factory. Always use these instead of inline arrays so cache
 * invalidations across screens stay coordinated.
 */
export const profileKeys = {
  all: ["profiles"] as const,
  detail: (userId: string) => [...profileKeys.all, userId] as const,
};

/**
 * Fetches the row in `profiles` whose id = userId.
 * Caller passes the userId explicitly (typically `useAuth().user?.id`) so this
 * hook stays decoupled from the auth context — easier to test and reuse.
 *
 * RLS already restricts reads to the caller's own row, so this is safe by
 * construction; passing another user's id would simply return null + a 401.
 *
 * `enabled` gates the fetch on a present userId (avoids a flash of error
 * while the AuthProvider is still resolving the session).
 */
export function useProfile(userId: string | undefined): UseQueryResult<ProfileRow> {
  return useQuery({
    queryKey: profileKeys.detail(userId ?? "anonymous"),
    queryFn: async () => {
      if (!userId) throw new Error("useProfile: userId is required");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
    // Profile mutations are rare per-session — give freshly fetched data a
    // longer window before refetch. Mutations invalidate the key explicitly.
    staleTime: 60_000,
  });
}

/**
 * Mutation that updates the current user's profile and optimistically reflects
 * the change in the React Query cache. On error the previous value is rolled
 * back; on settle (success or fail) the cache is invalidated so the next
 * read goes through Supabase again.
 *
 * Caller passes userId explicitly. Lockscreen-snapshot writes (Dev B) should
 * NOT call this hook — they trigger off the cache update via the cache key.
 */
export function useUpdateProfile(
  userId: string,
): UseMutationResult<ProfileRow, Error, ProfileUpdate, { previous: ProfileRow | undefined }> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (update: ProfileUpdate) => {
      const { data, error } = await supabase
        .from("profiles")
        .update(update)
        .eq("id", userId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onMutate: async (update) => {
      const key = profileKeys.detail(userId);
      await qc.cancelQueries({ queryKey: key });
      const previous = qc.getQueryData<ProfileRow>(key);
      if (previous) {
        qc.setQueryData<ProfileRow>(key, { ...previous, ...update });
      }
      return { previous };
    },
    onError: (_err, _update, ctx) => {
      if (ctx?.previous) {
        qc.setQueryData(profileKeys.detail(userId), ctx.previous);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: profileKeys.detail(userId) });
    },
  });
}

export type { ProfileRow, ProfileUpdate };
