import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { getEnv } from './lib/env';

export const initializeI18n = async () => {
  const { locale } = getEnv();
  const language =
    locale === 'ja' || locale === 'japanese'
      ? 'ja'
      : locale === 'en' || locale === 'english'
        ? 'en'
        : 'ja';

  try {
    await i18next.use(Backend).init({
      lng: language,
      fallbackLng: 'ja',
      preload: ['ja', 'en'],
      backend: {
        loadPath: './locales/{{lng}}/translations.json',
      },
    });
    return i18next;
  } catch (error) {
    console.log(error);
  }
};
