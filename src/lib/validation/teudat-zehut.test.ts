import { describe, expect, it } from "vitest";
import { isValidTeudatZehut, normalizeTeudatZehut } from "./teudat-zehut";

describe("isValidTeudatZehut", () => {
  describe("known valid IDs (computed by hand and re-verified against the public algorithm)", () => {
    // 1+4+3+8+5+3+7+7+2 = 40 ≡ 0 (mod 10)
    it("accepts 123456782", () => expect(isValidTeudatZehut("123456782")).toBe(true));

    // 5-digit historic ID (old Population Registry format) → padded 000018000
    // 0+0+0+0+0+0+0+2+8... wait — "00018" padded is "000000018"; sum = 10 ≡ 0
    it("accepts 000000018", () => expect(isValidTeudatZehut("000000018")).toBe(true));
    it("accepts the 5-digit form 00018 (gets padded)", () =>
      expect(isValidTeudatZehut("00018")).toBe(true));

    // 1+2+1+2+1+2+1+2+8 = 20 ≡ 0
    it("accepts 111111118", () => expect(isValidTeudatZehut("111111118")).toBe(true));

    // 9*1 + 18-9 + 9 + 18-9 + 9 + 18-9 + 9 + 18-9 + 8 = 9+9+9+9+9+9+9+9+8 = 80 ≡ 0
    it("accepts 999999998", () => expect(isValidTeudatZehut("999999998")).toBe(true));
  });

  describe("known invalid IDs (checksum fails)", () => {
    // 1+4+3+8+5+3+7+7+9 = 47
    it("rejects 123456789", () => expect(isValidTeudatZehut("123456789")).toBe(false));

    // 1+2+1+2+1+2+1+2+1 = 13
    it("rejects 111111111", () => expect(isValidTeudatZehut("111111111")).toBe(false));

    // pad 12345 → 000012345; 0+0+0+0+1+4+3+8+5 = 21
    it("rejects 12345", () => expect(isValidTeudatZehut("12345")).toBe(false));
  });

  describe("length bounds", () => {
    it("rejects 0 digits", () => expect(isValidTeudatZehut("")).toBe(false));
    it("rejects 4 digits (below minimum)", () => expect(isValidTeudatZehut("1234")).toBe(false));
    it("rejects 10 digits (above maximum)", () =>
      expect(isValidTeudatZehut("1234567890")).toBe(false));
  });

  describe("input normalization", () => {
    it("accepts hyphens between digits", () => expect(isValidTeudatZehut("123-456-782")).toBe(true));
    it("accepts spaces between digits", () => expect(isValidTeudatZehut("123 456 782")).toBe(true));
    it("accepts mixed whitespace+hyphens", () =>
      expect(isValidTeudatZehut(" 123-456 782 ")).toBe(true));
  });

  describe("malformed input", () => {
    it("rejects non-digit chars", () => expect(isValidTeudatZehut("12a456782")).toBe(false));
    it("rejects emoji", () => expect(isValidTeudatZehut("1234567😀")).toBe(false));
    it("rejects Hebrew letters", () => expect(isValidTeudatZehut("12345678ת")).toBe(false));
    // Defence against runtime callers ignoring the type signature.
    it("rejects non-strings (defence-in-depth)", () => {
      // @ts-expect-error — testing runtime guard
      expect(isValidTeudatZehut(123456782)).toBe(false);
      // @ts-expect-error — testing runtime guard
      expect(isValidTeudatZehut(null)).toBe(false);
      // @ts-expect-error — testing runtime guard
      expect(isValidTeudatZehut(undefined)).toBe(false);
    });
  });
});

describe("normalizeTeudatZehut", () => {
  it("returns the 9-digit canonical form for a valid ID", () => {
    expect(normalizeTeudatZehut("123456782")).toBe("123456782");
  });

  it("left-pads short IDs to 9 digits", () => {
    expect(normalizeTeudatZehut("00018")).toBe("000000018");
  });

  it("strips separators before padding", () => {
    expect(normalizeTeudatZehut("123-456-782")).toBe("123456782");
  });

  it("returns null for invalid IDs", () => {
    expect(normalizeTeudatZehut("123456789")).toBeNull();
  });

  it("returns null for malformed input", () => {
    expect(normalizeTeudatZehut("abc")).toBeNull();
  });
});
