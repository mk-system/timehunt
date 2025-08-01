import * as packageJson from '../package.json';

export const displayHowToUse = () => {
  return `Version ${packageJson.version}
    Usage: timehunt hunt <events_name>
           timehunt fix <old_events_name> <new_events_name> <new_schedule_datetime>
           timehunt config [show|set]

    Manage your events:
      hunt                  Displays a list of events with the <events_name> you specify.
      fix                   Delete all <old_events_name> and create an event named <new_events_name> with a date and time of <new_schedule_datetime>.

    Configuration:
      config show           Display current configuration settings.
      config set            Modify configuration settings (date format, time format, time separator).
  `;
};
