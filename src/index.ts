import { Credentials, OAuth2Client } from 'google-auth-library';
import { calendar_v3 } from 'googleapis';
import { parseISO, isSameHour, format } from 'date-fns';
import { ja } from 'date-fns/locale';
import fs from 'fs';
import {
  REDIRECT_URL,
  JSON_FILE_PATH,
  googleClientID,
  googleClientSecret,
  getCredentials,
  getEvents,
} from './utility/googleApiUtility';

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

  try {
    console.log('Upcoming events:');
    const events = await getEvents(oauth2Client, process.argv[2]); // Get event name from command line argument
    if (events) {
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

listEvents();
