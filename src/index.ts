import {
  getCredentials,
  getEvents,
  initializeOAuth2Client,
} from './util/googleApiUtility';
import {
  displayDateTimeRange,
  groupEventsByDate,
} from './util/dateTimeUtility';
import { fixCommandHandler } from './fix';

const listEvents = async () => {
  const oauth2Client = await initializeOAuth2Client();

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

if (process.argv[2] === 'fix') {
  fixCommandHandler();
} else {
  listEvents();
}
