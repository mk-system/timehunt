import { calendar_v3, google } from 'googleapis';
import { Credentials, OAuth2Client } from 'google-auth-library';
import { getEnv } from '../lib/env';
import readline from 'readline';
import { homedir } from 'os';
import { join } from 'path';
import fs from 'fs';

export const REDIRECT_URL = 'urn:ietf:wg:oauth:2.0:oob';
export const { googleClientID, googleClientSecret, googleCalendarID } =
  getEnv();
const SCOPE = ['https://www.googleapis.com/auth/calendar'];

export const JSON_DIR_PATH = join(homedir(), '.conf', 'timehunt', 'cache');
export const JSON_FILE_PATH = join(JSON_DIR_PATH, 'token.json');

export const getCredentialsFromJSON = (JSONFilePath: string) => {
  const buff = fs.readFileSync(JSONFilePath, 'utf8');
  try {
    return JSON.parse(buff) as Credentials;
  } catch (error) {
    return undefined;
  }
};

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

export const getEvents = async (
  oauth2Client: OAuth2Client,
  eventName: string
) => {
  const calendar = google.calendar({
    version: 'v3',
    auth: oauth2Client,
  });

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const timeMin = now.toISOString();

  try {
    const response = await calendar.events.list({
      calendarId: googleCalendarID,
      q: eventName,
      singleEvents: true,
      orderBy: 'startTime',
      timeMin: timeMin,
    });
    const events = response.data.items;
    if (events) {
      return response.data.items as calendar_v3.Schema$Event[];
    }
  } catch (error) {
    console.log(error);
  }
  return undefined;
};
