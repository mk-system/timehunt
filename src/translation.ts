import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import translationJa from './locales/ja.json';
import translationEn from './locales/en.json';
import { getLanguage } from './lib/env';

export const initializeI18n = async () => {
  const resources = {
    ja: { translation: translationJa },
    en: { translation: translationEn },
  };

  await i18next.use(Backend).init({
    lng: getLanguage(),
    fallbackLng: 'en',
    resources,
  });
};
