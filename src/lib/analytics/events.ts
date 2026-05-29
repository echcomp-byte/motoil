// Phase 1 analytics events. Names are stable — once shipped, do not rename
// (PostHog dashboards reference these as string literals).

export type AnalyticsEvent =
  | "install"
  | "signup"
  | "profile_completed"
  | "qr_scanned"
  | "qr_revoked"
  | "widget_installed";

export type AnalyticsProps = Record<string, string | number | boolean | null>;
