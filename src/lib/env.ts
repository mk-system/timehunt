import 'dotenv/config';

export const GOOGLE_CLIENT_ID = '985313163629-03oobt1mkn2ie11kbjcb4lpjf3djtjlt.apps.googleusercontent.com';
export const GOOGLE_CLIENT_SECRET = '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';

export const getEnv = () => {
  const { GOOGLE_CALENDAR_ID } = process.env;

  if (!GOOGLE_CALENDAR_ID) {
    throw Error('Please set the environment variable GOOGLE_CALENDAR_ID.');
  }

  return {
    googleCalendarID: GOOGLE_CALENDAR_ID,
  };
};

export const getLanguage = () => {
  return process.env.LANG?.split('.')[0] || '';
};
