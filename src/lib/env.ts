import { getConfigValue } from '../util/config';

// TV and Limited Input devices OAuth credentials
// Google acknowledges client_secret is non-sensitive for this client type
export const GOOGLE_CLIENT_ID = '985313163629-ecj5ql7n22m7s3ao7mfom3d5e9upvi2q.apps.googleusercontent.com';
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
