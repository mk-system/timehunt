import { loadConfig, saveConfig, Config } from './util/config';
import { initializeOAuth2Client, getCalendarList } from './util/googleApiUtility';
import { OAuth2Client } from 'google-auth-library';
import * as readline from 'readline';

type QuestionFn = (query: string) => Promise<string>;

const showCurrentConfig = (): void => {
  const config = loadConfig();
  console.log(`DATE_FORMAT=${config.DATE_FORMAT}`);
  console.log(`TIME_FORMAT=${config.TIME_FORMAT}`);
  console.log(`TIME_SEPERATOR=${config.TIME_SEPERATOR}`);
  console.log(`GOOGLE_CALENDAR_ID=${config.GOOGLE_CALENDAR_ID}`);
};

const selectCalendar = async (oauth2Client: OAuth2Client, question: QuestionFn): Promise<string | undefined> => {
  console.log('Fetching calendars...');
  const calendars = await getCalendarList(oauth2Client);

  if (calendars.length === 0) {
    console.log('No calendars found.');
    return undefined;
  }

  calendars.forEach((cal, i) => {
    console.log(`  ${i + 1}. ${cal.summary} (${cal.id})`);
  });

  const answer = await question(`Select a calendar [1-${calendars.length}]: `);
  const index = parseInt(answer.trim(), 10) - 1;

  if (isNaN(index) || index < 0 || index >= calendars.length) {
    console.log('Invalid selection.');
    return undefined;
  }

  return calendars[index].id ?? undefined;
};

const updateConfig = async (question: QuestionFn): Promise<void> => {
  const oauth2Client = await initializeOAuth2Client();
  const config = loadConfig();

  console.log('\nModify configuration. Press Enter without input to keep current value.');

  const dateFormat = await question(`Date format [current: ${config.DATE_FORMAT}]: `);
  const timeFormat = await question(`Time format [current: ${config.TIME_FORMAT}]: `);
  const timeSeparator = await question(`Time separator [current: ${config.TIME_SEPERATOR}]: `);

  const updates: Partial<Config> = {};

  if (dateFormat.trim()) updates.DATE_FORMAT = dateFormat.trim();
  if (timeFormat.trim()) updates.TIME_FORMAT = timeFormat.trim();
  if (timeSeparator.trim()) updates.TIME_SEPERATOR = timeSeparator.trim();

  const changeCalendar = await question(`Change Google Calendar? [current: ${config.GOOGLE_CALENDAR_ID}] (y/N): `);
  if (changeCalendar.trim().toLowerCase() === 'y') {
    const calendarId = await selectCalendar(oauth2Client, question);
    if (calendarId) updates.GOOGLE_CALENDAR_ID = calendarId;
  }

  if (Object.keys(updates).length > 0) {
    saveConfig(updates);
    showCurrentConfig();
  } else {
    console.log('No configuration changes made.');
  }
};

const parseKeyValue = (arg: string): { key: keyof Config; value: string } | null => {
  const match = arg.match(/^(DATE_FORMAT|TIME_FORMAT|TIME_SEPERATOR|GOOGLE_CALENDAR_ID)=(.+)$/);
  if (!match) return null;
  const [, key, value] = match;
  return { key: key as keyof Config, value };
};

export const configCommand = async (args: string[]): Promise<void> => {
  if (args.length === 0 || args[0] === 'show') {
    showCurrentConfig();
    return;
  }

  if (args[0] === 'set') {
    if (args.length === 1) {
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      const question: QuestionFn = (query) => new Promise(resolve => rl.question(query, resolve));
      await updateConfig(question);
      rl.close();
    } else {
      const updates: Partial<Config> = {};
      let hasValidArgs = false;

      for (let i = 1; i < args.length; i++) {
        const parsed = parseKeyValue(args[i]);
        if (parsed) {
          updates[parsed.key] = parsed.value;
          hasValidArgs = true;
        } else {
          console.log(`Invalid argument: ${args[i]}`);
        }
      }

      if (hasValidArgs && Object.keys(updates).length > 0) {
        saveConfig(updates);
        showCurrentConfig();
      } else if (!hasValidArgs) {
        console.log('No valid configuration arguments provided.');
      }
    }
  } else {
    console.log('Usage:');
    console.log('  timehunt config show                          - Display current configuration in KEY=value format');
    console.log('  timehunt config set                           - Interactive configuration');
    console.log('  timehunt config set KEY=VALUE [KEY=VALUE...] - Set specific values directly');
    console.log('\nAvailable keys:');
    console.log('  DATE_FORMAT       - Date format string');
    console.log('  TIME_FORMAT       - Time format string');
    console.log('  TIME_SEPERATOR    - Time separator character');
    console.log('  GOOGLE_CALENDAR_ID - Google Calendar ID');
    console.log('\nExamples:');
    console.log('  timehunt config set DATE_FORMAT=yyyy年MM月dd日(E)');
    console.log('  timehunt config set GOOGLE_CALENDAR_ID=your-email@gmail.com');
  }
};
