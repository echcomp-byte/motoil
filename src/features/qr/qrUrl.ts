// Placeholder until Vercel migration in Phase 2 — ENV var wraps it so the
// switch to the real domain is a single env update across all builds.
const DEFAULT_BASE = "https://ice.motoil.app";

const BASE = (process.env.EXPO_PUBLIC_QR_BASE_URL ?? DEFAULT_BASE).replace(/\/$/, "");

export function buildQrUrl(token: string): string {
  return `${BASE}/p/${token}`;
}

export function getQrBaseUrl(): string {
  return BASE;
}
