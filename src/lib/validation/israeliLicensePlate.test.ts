import { describe, expect, it } from "vitest";
import {
  formatIsraeliLicensePlate,
  isValidIsraeliLicensePlate,
  normalizeIsraeliLicensePlate,
} from "./israeliLicensePlate";

describe("isValidIsraeliLicensePlate", () => {
  describe("7-digit (pre-2017) format", () => {
    it("plain digits", () => expect(isValidIsraeliLicensePlate("1234567")).toBe(true));
    it("hyphenated XXX-XX-XX", () => expect(isValidIsraeliLicensePlate("123-45-67")).toBe(true));
    it("spaces", () => expect(isValidIsraeliLicensePlate("123 45 67")).toBe(true));
  });

  describe("8-digit (post-2017) format", () => {
    it("plain digits", () => expect(isValidIsraeliLicensePlate("12345678")).toBe(true));
    it("hyphenated XXX-XX-XXX", () => expect(isValidIsraeliLicensePlate("123-45-678")).toBe(true));
  });

  describe("rejected — wrong length", () => {
    it("6 digits", () => expect(isValidIsraeliLicensePlate("123456")).toBe(false));
    it("9 digits", () => expect(isValidIsraeliLicensePlate("123456789")).toBe(false));
    it("empty", () => expect(isValidIsraeliLicensePlate("")).toBe(false));
  });

  describe("rejected — non-digit content", () => {
    it("Latin letters", () => expect(isValidIsraeliLicensePlate("ABC1234")).toBe(false));
    it("Hebrew letters", () => expect(isValidIsraeliLicensePlate("123ת4567")).toBe(false));
    it("non-string", () => {
      // @ts-expect-error — testing runtime guard
      expect(isValidIsraeliLicensePlate(1234567)).toBe(false);
      // @ts-expect-error — testing runtime guard
      expect(isValidIsraeliLicensePlate(null)).toBe(false);
    });
  });
});

describe("formatIsraeliLicensePlate", () => {
  it("formats 7 digits as XXX-XX-XX", () =>
    expect(formatIsraeliLicensePlate("1234567")).toBe("123-45-67"));
  it("formats 8 digits as XXX-XX-XXX", () =>
    expect(formatIsraeliLicensePlate("12345678")).toBe("123-45-678"));
  it("re-formats already-hyphenated input", () =>
    expect(formatIsraeliLicensePlate("12-34-567")).toBe("123-45-67"));
  it("returns null for invalid", () => expect(formatIsraeliLicensePlate("123")).toBeNull());
});

describe("normalizeIsraeliLicensePlate", () => {
  it("returns digits only for valid plate", () =>
    expect(normalizeIsraeliLicensePlate("123-45-67")).toBe("1234567"));
  it("returns digits only for 8-digit plate", () =>
    expect(normalizeIsraeliLicensePlate("123-45-678")).toBe("12345678"));
  it("returns null for invalid", () =>
    expect(normalizeIsraeliLicensePlate("ABC1234")).toBeNull());
});
