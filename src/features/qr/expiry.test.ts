import { describe, expect, it } from "vitest";
import { computeExpiresAt, detectPreset, isExpired } from "./expiry";

const NOW = new Date("2026-06-01T12:00:00.000Z");

describe("computeExpiresAt", () => {
  it("returns null for never", () => {
    expect(computeExpiresAt("never", NOW)).toBeNull();
  });

  it("returns a future ISO string for finite presets", () => {
    expect(computeExpiresAt("1w", NOW)).toBe("2026-06-08T12:00:00.000Z");
    expect(computeExpiresAt("1m", NOW)).toBe("2026-07-01T12:00:00.000Z");
    expect(computeExpiresAt("3m", NOW)).toBe("2026-08-30T12:00:00.000Z");
    expect(computeExpiresAt("1y", NOW)).toBe("2027-06-01T12:00:00.000Z");
  });
});

describe("detectPreset", () => {
  it("identifies never", () => {
    expect(detectPreset(null, NOW)).toBe("never");
  });

  it("round-trips each finite preset", () => {
    for (const preset of ["1w", "1m", "3m", "1y"] as const) {
      const iso = computeExpiresAt(preset, NOW)!;
      expect(detectPreset(iso, NOW)).toBe(preset);
    }
  });

  it("treats a 4-hour drift as the same preset (tolerance window)", () => {
    const iso = computeExpiresAt("1m", NOW)!;
    const later = new Date(NOW.getTime() + 4 * 60 * 60 * 1000);
    expect(detectPreset(iso, later)).toBe("1m");
  });

  it("returns null for off-grid values (manual edits)", () => {
    const odd = new Date(NOW.getTime() + 42 * 24 * 60 * 60 * 1000).toISOString();
    expect(detectPreset(odd, NOW)).toBeNull();
  });
});

describe("isExpired", () => {
  it("never expires when expires_at is null", () => {
    expect(isExpired(null, NOW)).toBe(false);
  });

  it("flags past timestamps as expired", () => {
    expect(isExpired("2026-05-30T00:00:00.000Z", NOW)).toBe(true);
  });

  it("treats future timestamps as not expired", () => {
    expect(isExpired("2027-06-01T00:00:00.000Z", NOW)).toBe(false);
  });
});
