# timehunt

- This application retrieves and displays appointments from Google Calendar.
- Node.js is required for operation.
- This software is released under the MIT License, see LICENSE.txt.


## How to use this app

### Installation

```bash
npm i -g @mk-system/timehunt
```

### Setup

#### 1. Authenticate with Google

Run any command for the first time. timehunt will display a URL and a short code:

```
Authentication required:
1. Visit: https://google.com/device
2. Enter code: ABCD-1234
```

Open the URL on any device, enter the code, and sign in with your Google account. The token is saved to `~/.cache/timehunt/token.json` and reused on subsequent runs.

#### 2. Select your Google Calendar

```bash
timehunt config set
```

When prompted to change the Google Calendar, enter `y` to fetch your calendars and select one interactively:

```
Change Google Calendar? [current: ] (y/N): y
Fetching calendars...
  1. Personal (user@gmail.com)
  2. Work (xxx@group.calendar.google.com)
Select a calendar [1-2]: 1
```

You can also set it directly:

```bash
# By calendar ID
timehunt config set GOOGLE_CALENDAR_ID=your-email@gmail.com

# Or via environment variable
export GOOGLE_CALENDAR_ID="your-email@gmail.com"
```

#### 3. Configure date/time formats (optional)

```bash
timehunt config set DATE_FORMAT="yyyy年MM月dd日(E)" TIME_FORMAT="H:mm"
timehunt config show
```

Configuration is stored in `~/.config/timehunt/config.json` following the XDG Base Directory specification.

### Features
- **Device Flow Authentication**: Sign in from any browser without a local server
- **Interactive Calendar Selection**: Pick your calendar from a list — no need to know the calendar ID
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Flexible Configuration**: Environment variables or XDG-compliant config file
- **Customizable Formats**: Configure date, time formats and separators

### Execution command

```bash
timehunt hunt "meeting"
timehunt fix "old-meeting" "new-meeting" "2024-01-15 10:00-11:00"
timehunt config show
timehunt help
```

### Execution result

```bash
Upcoming events:
Tue, 21 Dec 2023 : 1:00 PM-2:00 PM or 3:00 PM-4:00 PM
Fri, 22 Dec 2023 : All day
Fri, 01 Jan 2024 : 10:15 AM-1:15 PM
```