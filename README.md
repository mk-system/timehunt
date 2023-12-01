# timehunt

- This application retrieves and displays appointments from Google Calendar.
- Node.js is required for operation.
- This software is released under the MIT License, see LICENSE.txt.


## How to use this app

### Environment setting

```.env
GOOGLE_CLIENT_ID="(Get it from Google Cloud Console)"
GOOGLE_CLIENT_SECRET="(Get it from Google Cloud Console)"
GOOGLE_CALENDAR_ID="(Please paste your own Google Calendar calendar ID)"
```

### Execution command

```bash
npm i -g pnpm
pnpm i
pnpm run hunt "meeting"
```

### Execution result

```bash
Upcoming events:
2023年11月29日(水) : 15:00～16:00
2023年12月6日(水) : 15:00～16:00
2023年12月13日(水) : 15:00～16:00
2023年12月20日(水) : 15:00～16:00
...
```