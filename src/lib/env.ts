import 'dotenv/config';
import { getConfigValue } from '../util/config';

// Desktop application OAuth credentials - safe to embed in public code
// These credentials are for a desktop app and can be safely embedded in public repositories
export const GOOGLE_CLIENT_ID = '985313163629-03oobt1mkn2ie11kbjcb4lpjf3djtjlt.apps.googleusercontent.com';
export const GOOGLE_CLIENT_SECRET = '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';

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
