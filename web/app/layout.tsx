import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { dir, pickLang } from "@/lib/lang";
import "./globals.css";

export const metadata: Metadata = {
  title: "MotoIL Emergency Card",
  description: "Public rescue card for MotoIL riders.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "none",
      "max-snippet": -1,
    },
  },
  referrer: "no-referrer",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

// Async so we can read the request's Accept-Language and stamp the html
// element with a correct `lang` + `dir` attribute. Screen readers rely on
// `lang` for pronunciation, and Lighthouse fails a11y without it.
//
// The page-level component still overrides `dir` on <main> when the user
// passes ?lang=, so the body content can disagree with this attribute on
// override — we keep the html attribute on the Accept-Language default
// because that's the dominant case and changing the html element per
// search-param would force the layout to read searchParams (which it
// can't in App Router).
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const lang = pickLang(h.get("accept-language"));
  return (
    <html lang={lang} dir={dir(lang)}>
      <body>{children}</body>
    </html>
  );
}
