import 'dotenv/config';

export const getEnv = () => {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALENDAR_ID, LOCALE } =
    process.env;

  if (!GOOGLE_CLIENT_ID) {
    throw Error('Please set the environment variable GOOGLE_CLIENT_ID.');
  }
  if (!GOOGLE_CLIENT_SECRET) {
    throw Error('Please set the environment variable GOOGLE_CLIENT_SECRET.');
  }
  if (!GOOGLE_CALENDAR_ID) {
    throw Error('Please set the environment variable GOOGLE_CALENDAR_ID.');
  }
  if (!LOCALE) {
    throw Error('Please set the environment variable LOCALE.');
  }

  return {
    googleClientID: GOOGLE_CLIENT_ID,
    googleClientSecret: GOOGLE_CLIENT_SECRET,
    googleCalendarID: GOOGLE_CALENDAR_ID,
    locale: LOCALE,
  };
};
