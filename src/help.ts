import * as packageJson from '../package.json';

export const displayHowToUse = () => {
  return `Version ${packageJson.version}
    Usage: timehunt [command] [flags]

    Manage your events:
      hunt                  Displays a list of events with the name you specify.
      fix                   Delete all [old_events_name] and create an event named [new_events_name] with a date and time of [new_schedule_datetime].
  `;
};
