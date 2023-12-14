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
import { exit } from 'process';

const listEvents = async (eventName: string) => {
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
    await getCredentials(oauth2Client);
    await listEvents(eventName);
  } finally {
    exit();
  }
};

const HOW_TO_USE_HUNT =
  'Displays a list of events with the name you specify.\n  timehunt hunt [events_name]';
const HOW_TO_USE_FIX =
  'Delete all [old_events_name] and create an event named [new_events_name] with a date and time of [new_schedule_datetime].\n  timehunt fix [old_events_name] [new_events_name] [new_schedule_datetime]';

process.argv[2] === 'hunt'
  ? listEvents(process.argv[3])
  : process.argv[2] === 'fix'
    ? fixCommandHandler(process.argv[3], process.argv[4], process.argv[5])
    : console.log(
        `How to use timehunt:\n${HOW_TO_USE_HUNT}\n${HOW_TO_USE_FIX}`
      );
