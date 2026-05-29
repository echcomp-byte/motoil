import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import he from "./locales/he.json";
import { getStoredLanguage } from "./storage";

const deviceLang = getLocales()[0]?.languageCode ?? "he";

// eslint-disable-next-line import/no-named-as-default-member -- idiomatic i18next setup
i18n.use(initReactI18next).init({
  resources: {
    he: { translation: he },
    en: { translation: en },
  },
  lng: deviceLang === "en" ? "en" : "he",
  fallbackLng: "he",
  interpolation: { escapeValue: false },
  compatibilityJSON: "v4",
  returnNull: false,
});

// Fire-and-forget: upgrade i18n to the user's stored language preference after
// init. UI re-renders via useTranslation. A brief device-language flash is
// possible on first render; acceptable vs. blocking app boot on storage.
void getStoredLanguage().then((stored) => {
  if (stored && stored !== i18n.language) {
    // eslint-disable-next-line import/no-named-as-default-member -- idiomatic i18next call
    void i18n.changeLanguage(stored);
  }
});

export default i18n;
