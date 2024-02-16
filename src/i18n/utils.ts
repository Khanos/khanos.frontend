import { ui, defaultLang } from './ui';

export function getLang() {
  return defaultLang;
};

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  }
}