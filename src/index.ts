import { Credentials, OAuth2Client } from 'google-auth-library';
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
const JSON_DIR_PATH = join(homedir(), '.conf', 'timehunt', 'cache');
const JSON_FILE_PATH = join(JSON_DIR_PATH, 'token.json');

type Element = [Date, calendar_v3.Schema$Event[]];
type GroupEvents = Element[];

const getCredentials = async (oauth2Client: OAuth2Client) => {
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

const listEvents = async () => {
  const oauth2Client = new OAuth2Client(
    googleClientID,
    googleClientSecret,
    REDIRECT_URL
  );

  const credentials = fs.existsSync(JSON_FILE_PATH)
    ? getCredentialsFromJSON(JSON_FILE_PATH)
    : await getCredentials(oauth2Client);
  if (credentials) {
    oauth2Client.setCredentials(credentials);
  }

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
      const groupedEvents = groupEventsByDate(events);
      for (const [date, eventsOnDate] of groupedEvents) {
        const eventStrs = eventsOnDate.map(
          (event: calendar_v3.Schema$Event) => {
            const start = event.start?.dateTime ?? event.start?.date ?? '';
            const end = event.end?.dateTime ?? event.end?.date ?? '';
            return getTimeStr(start, end);
          }
        );
        console.log(
          `${convertToJapaneseDateFormat(
            date,
            'yyyy年M月d日(E)'
          )} : ${eventStrs.join(' or ')}`
        );
      }
      if (events.length > 10) {
        console.log('The number of events exceeds 10.');
      }
    } else {
      console.log('No upcoming events found.');
    }
  } catch (error) {
    console.log(error);
    await getCredentials(oauth2Client);
    await listEvents();
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

const getCredentialsFromJSON = (JSONFilePath: string) => {
  const buff = fs.readFileSync(JSONFilePath, 'utf8');
  try {
    return JSON.parse(buff) as Credentials;
  } catch (error) {
    return undefined;
  }
};

const groupEventsByDate = (events: calendar_v3.Schema$Event[]) => {
  return events.reduce((acc, event) => {
    const start = event.start?.dateTime || event.start?.date;
    if (start) {
      const key = format(parseISO(start), 'yyyy-MM-dd');
      if (
        acc.length === 0 ||
        format(acc[acc.length - 1][0], 'yyyy-MM-dd') !== key
      ) {
        acc.push([parseISO(key), [event]]);
      } else {
        acc[acc.length - 1][1].push(event);
      }
    }
    return acc;
  }, [] as GroupEvents);
};

listEvents();
