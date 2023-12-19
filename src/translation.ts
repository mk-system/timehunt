import * as i18n from 'i18n';
import path from 'path';
import { getEnv } from './lib/env';

export const initializeI18n = () => {
  i18n.configure({
    locales: ['ja', 'en'],
    directory: path.join(__dirname, '/locales'),
    objectNotation: true,
    updateFiles: false,
  });
};

export const convertToLocale = (key: string) => {
  const { locale } = getEnv();
  const language =
    locale === 'ja' || locale === 'japanese'
      ? 'ja'
      : locale === 'en' || locale === 'english'
        ? 'en'
        : 'ja';
  i18n.setLocale(language);
  return i18n.__(key);
};
