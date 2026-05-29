export type Lang = "he" | "en";

const SUPPORTED: Lang[] = ["he", "en"];

export function pickLang(acceptLanguage: string | null, override?: string): Lang {
  if (override && (SUPPORTED as string[]).includes(override)) {
    return override as Lang;
  }
  if (!acceptLanguage) return "he";
  const tags = acceptLanguage
    .split(",")
    .map((part) => part.trim().split(";")[0].toLowerCase());
  for (const tag of tags) {
    const base = tag.split("-")[0];
    if (base === "he" || base === "iw") return "he";
    if (base === "en") return "en";
  }
  return "he";
}

export function dir(lang: Lang): "rtl" | "ltr" {
  return lang === "he" ? "rtl" : "ltr";
}
