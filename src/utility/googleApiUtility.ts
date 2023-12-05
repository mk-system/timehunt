import { Credentials, OAuth2Client } from 'google-auth-library';
import { getEnv } from '../lib/env';
import readline from 'readline';
import { homedir } from 'os';
import { join } from 'path';
import fs from 'fs';

export const REDIRECT_URL = 'urn:ietf:wg:oauth:2.0:oob';
export const { googleClientID, googleClientSecret, googleCalendarID } =
  getEnv();
export const SCOPE = ['https://www.googleapis.com/auth/calendar.readonly'];

export const JSON_DIR_PATH = join(homedir(), '.conf', 'timehunt', 'cache');
export const JSON_FILE_PATH = join(JSON_DIR_PATH, 'token.json');

export const getCredentials = async (oauth2Client: OAuth2Client) => {
  return new Promise<Credentials | undefined>((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPE,
    });

    console.log('Please open the URL on the right with your browser:\n', url);
    rl.question('Please paste the code shown: ', (code: string) => {
      oauth2Client.getToken(code, (_err, tokens) => {
        if (tokens) {
          fs.mkdirSync(JSON_DIR_PATH, { recursive: true });
          fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(tokens));
          console.log('Token has been issued: ', JSON_FILE_PATH);
          resolve(tokens);
        } else {
          resolve(undefined);
        }
      });
      rl.close();
    });
  });
};
