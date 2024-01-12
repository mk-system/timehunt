import {
  getCredentials,
  getEvents,
  initializeOAuth2Client,
} from './util/googleApiUtility';
import {
  displayDateTimeRange,
  groupEventsByDate,
} from './util/dateTimeUtility';
import { exit } from 'process';

export const huntCommandHandler = async (eventName: string) => {
  const oauth2Client = await initializeOAuth2Client();

  try {
    const events = await getEvents(oauth2Client, eventName);
    if (events) {
      const groupedEvents = groupEventsByDate(events);
      if (groupedEvents.length > 0) {
        console.log('Upcoming events:');
        await displayDateTimeRange(groupedEvents);
        if (events.length > 10) {
          console.log('The number of events exceeds 10.');
        }
      } else {
        console.log('No upcoming events found.');
      }
    } else {
      console.log('Could not found event.');
    }
  } catch (error) {
    console.log(error);
    await getCredentials(oauth2Client);
    await huntCommandHandler(eventName);
  } finally {
    exit();
  }
};
