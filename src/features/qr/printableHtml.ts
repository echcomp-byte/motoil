// Bilingual A4 rescue-card sticker.
//
// Intended use: rider prints this on A4 paper, cuts along the dotted line,
// and sticks the panel to a helmet / fuel tank. Paramedics scan the QR.
//
// Why bilingual on one page: a paramedic in Israel may default to Hebrew,
// but tourists, foreign volunteers, and the cross-border MDA-Magen David
// Adom mutual-aid flows means an EN line saves a few seconds of "what does
// this say". A few seconds matters in trauma triage.
//
// The HTML is intentionally tiny and self-contained — no external assets,
// no webfonts, no scripts. expo-print's renderer is a stripped-down WebView
// and the more we ask of it the more silently-broken edge cases we hit.

export type PrintableHtmlArgs = {
  /** base64-encoded PNG of the QR (no data: prefix). */
  qrPng: string;
  /** Public URL the QR resolves to — printed beneath as fallback. */
  url: string;
};

export function buildPrintableHtml({ qrPng, url }: PrintableHtmlArgs): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>MotoIL Emergency Card</title>
<style>
  @page { size: A4; margin: 16mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; color: #000; background: #fff;
    font-family: -apple-system, BlinkMacSystemFont, "Heebo", "Assistant", Arial, sans-serif; }
  .card {
    width: 100%;
    border: 2px dashed #000;
    border-radius: 12px;
    padding: 16mm 12mm;
    text-align: center;
  }
  .title-he { font-size: 26pt; font-weight: 700; direction: rtl; margin: 0 0 2mm; }
  .title-en { font-size: 16pt; font-weight: 500; color: #333; margin: 0 0 8mm; }
  .qr-wrap { display: inline-block; padding: 6mm; background: #fff; border: 1px solid #000; }
  .qr-wrap img { display: block; width: 70mm; height: 70mm; }
  .scan-he { font-size: 14pt; font-weight: 600; direction: rtl; margin: 8mm 0 1mm; }
  .scan-en { font-size: 12pt; color: #333; margin: 0 0 6mm; }
  .url { font-size: 9pt; color: #555; word-break: break-all; font-family: ui-monospace, Menlo, monospace; }
  .footer { display: flex; justify-content: space-between; font-size: 8pt; color: #777; margin-top: 6mm; }
  .cut { text-align: center; font-size: 9pt; color: #aaa; margin: 6mm 0 0; letter-spacing: 0.4em; }
</style>
</head>
<body>
  <div class="card">
    <h1 class="title-he">כרטיס חירום לאופנוען</h1>
    <p class="title-en">Motorcyclist Emergency Card</p>
    <div class="qr-wrap">
      <img alt="QR" src="data:image/png;base64,${qrPng}" />
    </div>
    <p class="scan-he">סרוק לקבלת מידע רפואי</p>
    <p class="scan-en">Scan to view medical information</p>
    <p class="url">${escapeHtml(url)}</p>
    <div class="footer">
      <span>MotoIL</span>
      <span>v0.1</span>
    </div>
  </div>
  <p class="cut">✂ — — — — — — — — — —</p>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
