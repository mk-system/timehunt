import * as i18n from 'i18n';
import path from 'path';
import { getEnv } from './lib/env';

export const initializeI18n = () => {
  const { locale } = getEnv();
  const language =
    locale === 'ja' || locale === 'japanese'
      ? 'ja'
      : locale === 'en' || locale === 'english'
        ? 'en'
        : 'ja';

  i18n.configure({
    locales: [language],
    directory: path.join(__dirname, '/locales'),
    objectNotation: true,
  });
};
