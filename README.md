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
npm i -g timehunt
timehunt hunt "meeting"
```

### Execution result

```bash
Upcoming events:
Tue, 21 Dec 2023 : 1:00 PM-2:00 PM or 3:00 PM-4:00 PM
Fri, 22 Dec 2023 : All day
Fri, 01 Jan 2024 : 10:15 AM-1:15 PM
```