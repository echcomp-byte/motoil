// No-op analytics shim. Dev D wires PostHog behind this interface once the
// project key lands in .env (EXPO_PUBLIC_POSTHOG_KEY). Until then, calls are
// safe to make from any feature — they do nothing.

import type { AnalyticsEvent, AnalyticsProps } from "./events";

export function track(_event: AnalyticsEvent, _props?: AnalyticsProps): void {
  // intentionally empty
}

export function identify(_userId: string, _props?: AnalyticsProps): void {
  // intentionally empty
}

export function reset(): void {
  // intentionally empty
}

export type { AnalyticsEvent, AnalyticsProps } from "./events";
