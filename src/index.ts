import { OAuth2Client } from 'google-auth-library';
import { calendar_v3 } from 'googleapis';
import { parseISO } from 'date-fns';
import fs from 'fs';
import {
  REDIRECT_URL,
  JSON_FILE_PATH,
  googleClientID,
  googleClientSecret,
  getCredentials,
  getCredentialsFromJSON,
  getEvents,
} from './util/googleApiUtility';
import {
  convertToJapaneseDateFormat,
  getTimeStr,
  groupEventsByDate,
} from './util/dateTimeUtility';

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
    const events = await getEvents(oauth2Client, process.argv[2]); // Get event name from command line argument
    if (events) {
      console.log('Upcoming events:');
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
            parseISO(date),
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
    await getCredentials(oauth2Client);
    await listEvents();
  }
};

listEvents();
