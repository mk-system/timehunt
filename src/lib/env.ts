import { getConfigValue } from '../util/config';

// Desktop application OAuth credentials - safe to embed in public code
// These credentials are for a desktop app using PKCE (no client_secret needed)
export const GOOGLE_CLIENT_ID = '985313163629-03oobt1mkn2ie11kbjcb4lpjf3djtjlt.apps.googleusercontent.com';

export const getEnv = () => {
  const envCalendarId = process.env.GOOGLE_CALENDAR_ID;
  const configCalendarId = getConfigValue('GOOGLE_CALENDAR_ID');

  const googleCalendarID = envCalendarId || configCalendarId;

  if (!googleCalendarID) {
    throw Error('Please set GOOGLE_CALENDAR_ID either as environment variable or in config file using: timehunt config set GOOGLE_CALENDAR_ID=your-email@gmail.com');
  }

  return {
    googleCalendarID,
  };
};

export const getLanguage = () => {
  return process.env.LANG?.split('.')[0] || '';
};
