import { OAuth2Client } from 'google-auth-library';
import readline from 'readline';
import { google, calendar_v3 } from 'googleapis';
import { parseISO, isSameHour, format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { getEnv } from './lib/env';
import fs from 'fs';
import { homedir } from 'os';
import { join } from 'path';

const { googleClientID, googleClientSecret, googleCalendarID } = getEnv();

const REDIRECT_URL = 'urn:ietf:wg:oauth:2.0:oob';
const SCOPE = ['https://www.googleapis.com/auth/calendar.readonly'];
const JSON_DIR_PATH = join(
  homedir(),
  '.conf',
  'calendar-event-searcher',
  'cache'
);
const JSON_FILE_PATH = join(JSON_DIR_PATH, 'token.json');

const oauth2Client = new OAuth2Client(
  googleClientID,
  googleClientSecret,
  REDIRECT_URL
);

const getAccessToken = (oauth2Client: OAuth2Client) => {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    oauth2Client.getToken(code, (err: any, tokens: any) => {
      fs.mkdirSync(JSON_DIR_PATH, { recursive: true });
      fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(tokens));
      console.log('Token has been issued: ', JSON_FILE_PATH);
    });
    rl.close();
  });
};

const listEvents = async () => {
  const calendar = google.calendar({
    version: 'v3',
    auth: oauth2Client,
  });

  const eventName = process.argv[2]; // Get event name from command line argument
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
      console.log('Upcoming events:');
      const events = response.data.items as calendar_v3.Schema$Event[];
      events.map((event: calendar_v3.Schema$Event) => {
        const start =
          (event.start?.dateTime as string) || (event.start?.date as string);
        const end =
          (event.end?.dateTime as string) || (event.end?.date as string);
        const timeStr = getTimeStr(start, end);
        console.log(
          `${convertToJapaneseDateFormat(
            parseISO(start),
            'yyyy年M月d日(E)'
          )} : ${timeStr}`
        );
      });
      if (events.length > 10) {
        console.log('The number of events exceeds 10.');
      }
    } else {
      console.log('No upcoming events found.');
    }
  } catch (error) {
    getAccessToken(oauth2Client);
  }
};

const isFullDay = (start: Date, end: Date) => {
  return isSameHour(start, 9) && isSameHour(end, 19);
};

const convertToJapaneseDateFormat = (
  date: Date,
  formatStr: string,
  locale: Locale = ja
) => {
  return format(date, formatStr, { locale });
};

const formatTime = (date: Date) => {
  return convertToJapaneseDateFormat(date, 'HH:mm');
};

const getTimeStr = (start: string, end: string) => {
  if (start === end) {
    return '終日';
  } else {
    const convertedStartTime = parseISO(start);
    const convertedEndTime = parseISO(end);

    if (isFullDay(convertedStartTime, convertedEndTime)) {
      return '終日';
    } else {
      const startTimeStr = formatTime(convertedStartTime);
      const endTimeStr = isSameHour(convertedEndTime, 19)
        ? ''
        : `～${formatTime(convertedEndTime)}`;
      return `${startTimeStr}${endTimeStr}`;
    }
  }
};

const isJson = (data: string) => {
  try {
    JSON.parse(data);
  } catch (error) {
    return false;
  }
  return true;
};

if (!fs.existsSync(JSON_FILE_PATH)) {
  getAccessToken(oauth2Client);
} else {
  const buff = fs.readFileSync(JSON_FILE_PATH, 'utf8');
  if (isJson(buff)) {
    const info = JSON.parse(buff);
    oauth2Client.setCredentials({
      access_token: info.access_token,
      refresh_token: info.refresh_token,
    });
    listEvents();
  } else {
    getAccessToken(oauth2Client);
  }
}
