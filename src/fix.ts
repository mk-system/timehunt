import readline from 'readline';
import {
  getCredentials,
  getEvents,
  deleteEvents,
  createEvent,
  initializeOAuth2Client,
} from './util/googleApiUtility';
import {
  displayDateTimeRange,
  dividedDateTimeRange,
  groupEventsByDate,
  isInRange,
} from './util/dateTimeUtility';
import { exit } from 'process';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const yes = async (question: string): Promise<boolean> => {
  return new Promise((resolve) => {
    rl.question(question, (response) => {
      const lowerCaseResponse = response.toLowerCase();
      if (lowerCaseResponse === 'y' || lowerCaseResponse === 'yes') {
        resolve(true);
      } else if (lowerCaseResponse === 'n' || lowerCaseResponse === 'no') {
        resolve(false);
      } else {
        resolve(yes(question));
      }
    });
  });
};

const fixCommandHandler = async () => {
  const oauth2Client = await initializeOAuth2Client();

  if (process.argv.length !== 5) {
    console.log('Arguments are wrong.');
    exit();
  }

  const dateTimeRange = process.argv[2];
  const afterEventName = process.argv[3];
  const beforeEventName = process.argv[4];

  try {
    const beforeEvents = await getEvents(oauth2Client, beforeEventName);
    if (beforeEvents) {
      const groupedEvents = groupEventsByDate(beforeEvents);
      if (groupedEvents.length > 0) {
        await displayDateTimeRange(groupedEvents);
        const [startDateTime, endDateTime] =
          dividedDateTimeRange(dateTimeRange);
        if (isInRange(startDateTime, endDateTime, beforeEvents)) {
          console.log('Are you sure to remove schedules?');
          if (await yes(`And add this?\n${dateTimeRange}\n(y/n) > `)) {
            await deleteEvents(oauth2Client, beforeEventName);
            await createEvent(
              oauth2Client,
              afterEventName,
              startDateTime,
              endDateTime
            );
          }
        } else {
          console.log(
            `"${beforeEventName}" is outside the scope of the retrieved event.`
          );
        }
      } else {
        console.log(`Could not find schedule in "${beforeEventName}" events.`);
      }
    } else {
      console.log('No upcoming events found.');
    }
  } catch (error) {
    await getCredentials(oauth2Client);
    await fixCommandHandler();
  } finally {
    rl.close();
  }
};

fixCommandHandler();
