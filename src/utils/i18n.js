import en from "../utils/locales/en/translation.json";
import de from "../utils/locales/de/translation.json"; // ✅ fixed this path

const translations = {
  en,
  de,
};

const langMap = {
  english: "en",
  german: "de",
};

let currentLang = sessionStorage.getItem("lang") || "en";

export const setLanguage = (lang) => {
  const mappedLang = langMap[lang] || "en";
  currentLang = mappedLang;
  sessionStorage.setItem("lang", mappedLang);
};

export const getLanguage = () => currentLang;

export const t = (key) => {
  return translations[currentLang]?.[key] || key;
};
