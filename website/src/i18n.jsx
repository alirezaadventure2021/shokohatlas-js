import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import fa from "./Locales/da/translation.json";
import en from "./Locales/en/translation.json";
import ru from "./Locales/ru/translation.json";

i18n
  .use(initReactI18next)
  .use(I18nextBrowserLanguageDetector)
  .init({
    fallbackLng: "fa",
    supportedLngs: ["en", "ru", "fa"],
    nonExplicitSupportedLngs: true,
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      fa: { translation: fa },
    },
    saveMissing: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["path"],
      lookupFromPathIndex: 0,
      caches: [], // don't cache in cookies or localStorage
    },
  });
export default i18n;
