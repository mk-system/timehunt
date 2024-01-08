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
Thu, 12/21/2023 : 13:00～14:00 or 15:00～16:00
Fri, 12/22/2023 : All day
Fri, 01/05/2024 : 10:15～13:15
```