import EnglishTraslations from './en';
import SpanishTraslations from './es';

export const languages = {
  en: 'English',
  es: 'Español',
};

export let defaultLang: "en" | "es" = 'en';

export function setDefaultLang(lang: "en" | "es") {
  defaultLang = lang;
};

export const ui = {
  en: EnglishTraslations,
  es: SpanishTraslations,
} as const;