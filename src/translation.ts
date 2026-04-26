import i18next from 'i18next';
import translationJa from './locales/ja.json';
import translationEn from './locales/en.json';
import { getLanguage } from './lib/env';

export const initializeI18n = async () => {
  const resources = {
    ja: { translation: translationJa },
    en: { translation: translationEn },
  };

  await i18next.init({
    lng: getLanguage(),
    fallbackLng: 'en',
    resources,
    showSupportNotice: false,
  });
};
