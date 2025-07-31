# timehunt

- This application retrieves and displays appointments from Google Calendar.
- Node.js is required for operation.
- This software is released under the MIT License, see LICENSE.txt.


## How to use this app

### Environment setting

```.env
GOOGLE_CALENDAR_ID="(Please paste your own Google Calendar calendar ID)"
```

**Note:** Google OAuth authentication is now built-in with PKCE flow. You no longer need to register your own Google Cloud Console application or set GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET.

### Features
- 🔐 **Secure PKCE Authentication**: Modern OAuth 2.0 PKCE flow for enhanced security
- 🌍 **Cross-Platform Support**: Works on Windows, macOS, and Linux
- 🚀 **Auto Browser Launch**: Automatically opens authentication page in your browser
- ⚡ **One-Click Setup**: Simple environment variable configuration
- 📅 **Google Calendar Integration**: Direct access to your calendar events

### Execution command

```bash
# Install globally
npm i -g @mk-system/timehunt

# Set your calendar ID
export GOOGLE_CALENDAR_ID="your-email@gmail.com"

# First run will open browser for Google authentication
timehunt hunt "meeting"
```

### Execution result

```bash
Upcoming events:
Tue, 21 Dec 2023 : 1:00 PM-2:00 PM or 3:00 PM-4:00 PM
Fri, 22 Dec 2023 : All day
Fri, 01 Jan 2024 : 10:15 AM-1:15 PM
```