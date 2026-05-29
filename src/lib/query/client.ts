import { QueryClient } from "@tanstack/react-query";

/**
 * Single shared QueryClient configuration.
 *
 * Defaults tuned for mobile:
 *   - staleTime 30s — most reads are cheap and we want freshness on screen focus.
 *   - gcTime 5min — keep cache around through brief background trips.
 *   - retry 2 — three total attempts on transient network errors.
 *   - refetchOnWindowFocus false — RN has no "window focus" in the web sense;
 *     React Query's RN integration uses AppState transitions instead.
 *   - refetchOnReconnect true — fetch fresh data when network comes back.
 *   - mutation retry disabled — mutations should fail loud, not silently retry
 *     (a re-tap is a user-driven retry).
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: false,
      },
    },
  });
}
