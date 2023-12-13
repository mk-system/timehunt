import fs from 'fs';
import {
  JSON_FILE_PATH,
  getCredentials,
  getCredentialsFromJSON,
  getEvents,
  getOAuth2Client,
} from './util/googleApiUtility';
import {
  displayDateTimeRange,
  groupEventsByDate,
} from './util/dateTimeUtility';

const listEvents = async () => {
  const oauth2Client = getOAuth2Client();

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
      await displayDateTimeRange(groupedEvents);
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
