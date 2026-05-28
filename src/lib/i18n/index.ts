import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import he from "./locales/he.json";

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

export default i18n;
