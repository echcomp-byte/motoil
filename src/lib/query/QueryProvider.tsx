import { QueryClientProvider } from "@tanstack/react-query";
import { useMemo, type ReactNode } from "react";
import { createQueryClient } from "./client";

/**
 * Wraps children in a QueryClientProvider with a stable QueryClient.
 * Mount once near the top of the tree (in app/_layout.tsx).
 *
 * Memoised so React Fast Refresh and parent re-renders don't churn the cache.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const client = useMemo(() => createQueryClient(), []);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
