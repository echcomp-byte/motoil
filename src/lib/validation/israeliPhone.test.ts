import { describe, expect, it } from "vitest";
import { isValidIsraeliMobile, normalizeIsraeliMobile } from "./israeliPhone";

describe("isValidIsraeliMobile", () => {
  describe("accepted formats", () => {
    it("national, no separators", () => expect(isValidIsraeliMobile("0501234567")).toBe(true));
    it("national, hyphen", () => expect(isValidIsraeliMobile("050-1234567")).toBe(true));
    it("national, spaces", () => expect(isValidIsraeliMobile("050 123 4567")).toBe(true));
    it("international, plus", () => expect(isValidIsraeliMobile("+972501234567")).toBe(true));
    it("international, plus + spaces", () =>
      expect(isValidIsraeliMobile("+972 50 123 4567")).toBe(true));
    it("international, no plus", () => expect(isValidIsraeliMobile("972501234567")).toBe(true));
  });

  describe("accepted carrier prefixes", () => {
    it("050 (Hot)", () => expect(isValidIsraeliMobile("0501234567")).toBe(true));
    it("052 (Cellcom)", () => expect(isValidIsraeliMobile("0521234567")).toBe(true));
    it("053 (Pelephone)", () => expect(isValidIsraeliMobile("0531234567")).toBe(true));
    it("054 (Partner)", () => expect(isValidIsraeliMobile("0541234567")).toBe(true));
    it("055 (Hot)", () => expect(isValidIsraeliMobile("0551234567")).toBe(true));
    it("058 (Golan/We)", () => expect(isValidIsraeliMobile("0581234567")).toBe(true));
    // Forward-compat: any 05X is accepted.
    it("059 (reserved/future)", () => expect(isValidIsraeliMobile("0591234567")).toBe(true));
  });

  describe("rejected — wrong length", () => {
    it("too short", () => expect(isValidIsraeliMobile("050123")).toBe(false));
    it("too long", () => expect(isValidIsraeliMobile("05012345678")).toBe(false));
    it("empty", () => expect(isValidIsraeliMobile("")).toBe(false));
  });

  describe("rejected — not a mobile", () => {
    it("Tel Aviv landline (03)", () => expect(isValidIsraeliMobile("031234567")).toBe(false));
    it("Jerusalem landline (02)", () => expect(isValidIsraeliMobile("021234567")).toBe(false));
    it("Haifa landline (04)", () => expect(isValidIsraeliMobile("041234567")).toBe(false));
    it("starts with 06 (not assigned to mobile)", () =>
      expect(isValidIsraeliMobile("0601234567")).toBe(false));
  });

  describe("rejected — foreign", () => {
    it("UK mobile", () => expect(isValidIsraeliMobile("+44 7700 900123")).toBe(false));
    it("US mobile", () => expect(isValidIsraeliMobile("+1 415 555 0100")).toBe(false));
  });

  describe("rejected — malformed", () => {
    it("letters", () => expect(isValidIsraeliMobile("050-ABCD-EFG")).toBe(false));
    it("Hebrew", () => expect(isValidIsraeliMobile("טלפון")).toBe(false));
    it("non-string", () => {
      // @ts-expect-error — testing runtime guard
      expect(isValidIsraeliMobile(null)).toBe(false);
      // @ts-expect-error — testing runtime guard
      expect(isValidIsraeliMobile(undefined)).toBe(false);
    });
  });
});

describe("normalizeIsraeliMobile", () => {
  it("national → E.164", () =>
    expect(normalizeIsraeliMobile("0501234567")).toBe("+972501234567"));
  it("national with separators → E.164", () =>
    expect(normalizeIsraeliMobile("050-123-4567")).toBe("+972501234567"));
  it("international with + → E.164 (idempotent)", () =>
    expect(normalizeIsraeliMobile("+972501234567")).toBe("+972501234567"));
  it("international without + → adds +", () =>
    expect(normalizeIsraeliMobile("972501234567")).toBe("+972501234567"));
  it("invalid input → null", () => expect(normalizeIsraeliMobile("031234567")).toBeNull());
});
