import { loadConfig, saveConfig, Config } from './util/config';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query: string): Promise<string> => {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
};

const showCurrentConfig = (): void => {
  const config = loadConfig();
  console.log(`DATE_FORMAT=${config.DATE_FORMAT}`);
  console.log(`TIME_FORMAT=${config.TIME_FORMAT}`);
  console.log(`TIME_SEPERATOR=${config.TIME_SEPERATOR}`);
  console.log(`GOOGLE_CALENDAR_ID=${config.GOOGLE_CALENDAR_ID}`);
};

const updateConfig = async (): Promise<void> => {
  const config = loadConfig();
  
  console.log('\nModify configuration. Press Enter without input to keep current value.');
  
  const dateFormat = await question(`Date format [current: ${config.DATE_FORMAT}]: `);
  const timeFormat = await question(`Time format [current: ${config.TIME_FORMAT}]: `);
  const timeSeparator = await question(`Time separator [current: ${config.TIME_SEPERATOR}]: `);
  const googleCalendarId = await question(`Google Calendar ID [current: ${config.GOOGLE_CALENDAR_ID}]: `);
  
  const updates: Partial<Config> = {};
  
  if (dateFormat.trim()) {
    updates.DATE_FORMAT = dateFormat.trim();
  }
  if (timeFormat.trim()) {
    updates.TIME_FORMAT = timeFormat.trim();
  }
  if (timeSeparator.trim()) {
    updates.TIME_SEPERATOR = timeSeparator.trim();
  }
  if (googleCalendarId.trim()) {
    updates.GOOGLE_CALENDAR_ID = googleCalendarId.trim();
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
  } else if (args[0] === 'set') {
    if (args.length === 1) {
      await updateConfig();
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
  
  rl.close();
};