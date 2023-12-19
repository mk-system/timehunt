import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import translationJa from './locales/ja.json';
import translationEn from './locales/en.json';
import { getEnv } from './lib/env';

export const initializeI18n = async () => {
  const { locale } = getEnv();
  const language =
    locale === 'ja' || locale === 'japanese'
      ? 'ja'
      : locale === 'en' || locale === 'english'
        ? 'en'
        : 'ja';

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
