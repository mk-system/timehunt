import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import translationJa from './locales/ja.json';
import translationEn from './locales/en.json';

export const initializeI18n = async () => {
  const language = process.env.LANG?.split('.')[0] || '';

  const resources = {
    ja: { translation: translationJa },
    en: { translation: translationEn },
  };

  await i18next.use(Backend).init({
    lng: language,
    fallbackLng: 'en',
    resources,
  });
};
