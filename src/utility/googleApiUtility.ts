import { getEnv } from '../lib/env';

export const REDIRECT_URL = 'urn:ietf:wg:oauth:2.0:oob';
export const { googleClientID, googleClientSecret, googleCalendarID } =
  getEnv();
