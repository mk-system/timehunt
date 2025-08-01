# timehunt

- This application retrieves and displays appointments from Google Calendar.
- Node.js is required for operation.
- This software is released under the MIT License, see LICENSE.txt.


## How to use this app

### Configuration

You can configure timehunt using either environment variables or the built-in configuration system:

#### Option 1: Environment Variable
```.env
GOOGLE_CALENDAR_ID="your-email@gmail.com"
```

#### Option 2: Configuration File (Recommended)
```bash
# Set your Google Calendar ID
timehunt config set GOOGLE_CALENDAR_ID=your-email@gmail.com

# View current configuration
timehunt config show

# Configure date/time formats
timehunt config set DATE_FORMAT="yyyy年MM月dd日(E)" TIME_FORMAT="H:mm"
```

Configuration is stored in `~/.config/timehunt/config.json` following XDG Base Directory specification.

**Note:** Google OAuth authentication is now built-in with PKCE flow. You no longer need to register your own Google Cloud Console application or set GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET.

### Features
- 🔐 **Secure PKCE Authentication**: Modern OAuth 2.0 PKCE flow for enhanced security
- 🌍 **Cross-Platform Support**: Works on Windows, macOS, and Linux
- 🚀 **Auto Browser Launch**: Automatically opens authentication page in your browser
- ⚙️ **Flexible Configuration**: Environment variables or XDG-compliant config file
- 🎨 **Customizable Formats**: Configure date, time formats and separators
- 📅 **Google Calendar Integration**: Direct access to your calendar events

### Execution command

```bash
# Install globally
npm i -g @mk-system/timehunt

# Set your calendar ID (choose one method)
export GOOGLE_CALENDAR_ID="your-email@gmail.com"  # Environment variable
# OR
timehunt config set GOOGLE_CALENDAR_ID=your-email@gmail.com  # Configuration file

# First run will open browser for Google authentication
timehunt hunt "meeting"

# Additional commands
timehunt fix "old-meeting" "new-meeting" "2024-01-15 10:00-11:00"
timehunt config show  # View current settings
timehunt help         # Show all available commands
```

### Execution result

```bash
Upcoming events:
Tue, 21 Dec 2023 : 1:00 PM-2:00 PM or 3:00 PM-4:00 PM
Fri, 22 Dec 2023 : All day
Fri, 01 Jan 2024 : 10:15 AM-1:15 PM
```