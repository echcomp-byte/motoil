import { describe, expect, it } from "vitest";
import { buildPrintableHtml } from "./printableHtml";

const FAKE_PNG =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgAAIAAAUAAen63NgAAAAASUVORK5CYII=";

describe("buildPrintableHtml", () => {
  it("renders an A4 page with both Hebrew and English copy", () => {
    const html = buildPrintableHtml({
      qrPng: FAKE_PNG,
      url: "https://example.test/p/abc",
    });

    expect(html).toContain("@page { size: A4");
    expect(html).toContain("כרטיס חירום לאופנוען");
    expect(html).toContain("Motorcyclist Emergency Card");
    expect(html).toContain("סרוק לקבלת מידע רפואי");
    expect(html).toContain("Scan to view medical information");
  });

  it("embeds the QR PNG as a data URI with the correct mime", () => {
    const html = buildPrintableHtml({
      qrPng: FAKE_PNG,
      url: "https://example.test/p/abc",
    });

    expect(html).toContain(`src="data:image/png;base64,${FAKE_PNG}"`);
  });

  it("escapes URL HTML metacharacters so an attacker-controlled token cannot inject markup", () => {
    // public_tokens.token is a uuid so this can't happen at runtime today,
    // but the helper sits one rename away from being reused — defensive escape.
    const evilUrl = `https://example.test/p/<script>alert("x")</script>`;
    const html = buildPrintableHtml({ qrPng: FAKE_PNG, url: evilUrl });

    expect(html).not.toContain("<script>alert");
    expect(html).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
  });

  it("includes the URL as plain text fallback", () => {
    const html = buildPrintableHtml({
      qrPng: FAKE_PNG,
      url: "https://example.test/p/abc",
    });
    expect(html).toContain("https://example.test/p/abc");
  });
});
