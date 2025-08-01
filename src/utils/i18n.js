import en from "../utils/locales/en/translation.json";
import de from "../utils/locales/de/translation.json"; 

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
  // Accept both 'en' or 'english', safely
  const mappedLang = langMap[lang?.toLowerCase()] || lang || "en";
  currentLang = mappedLang;
  sessionStorage.setItem("lang", mappedLang);
};


export const getLanguage = () => sessionStorage.getItem("lang") || "en";

export const t = (key, replacements = {}) => {
  const currentLang = getLanguage();
  const keys = key.split(".");
  
  let translation = keys.reduce((obj, k) => obj?.[k], translations[currentLang]);

  if (!translation && currentLang !== "en") {
    translation = keys.reduce((obj, k) => obj?.[k], translations["en"]);
  }

  if (!translation) return key;

  // Replace placeholders like {{type}} with values from `replacements`
  Object.entries(replacements).forEach(([k, v]) => {
    translation = translation.replace(new RegExp(`{{\\s*${k}\\s*}}`, "g"), v);
  });

  return translation;
};