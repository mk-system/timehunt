import { OAuth2Client } from 'google-auth-library';
import readline from 'readline';
import { google, calendar_v3 } from 'googleapis';
import { parseISO, isSameHour, format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { getEnv } from './lib/env';

const {
  googleClientID,
  googleClientSecret,
  googleAccessToken,
  googleRefreshToken,
  googleCalendarID,
} = getEnv();

const REDIRECT_URL = 'urn:ietf:wg:oauth:2.0:oob';
const SCOPE = ['https://www.googleapis.com/auth/calendar.readonly'];

const oauth2Client = new OAuth2Client(
  googleClientID,
  googleClientSecret,
  REDIRECT_URL
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAccessToken = (oauth2Client: OAuth2Client) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPE,
  });

  console.log('右記のURLをブラウザで開いてください: ', url);
  rl.question('表示されたコードを貼り付けてください: ', (code: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    oauth2Client.getToken(code, (err: any, tokens: any) => {
      console.log('トークンが発行されました');
      console.log(tokens);
      console.log('上記の情報を大切に保管してください');
    });
    rl.close();
  });
}

const listEvents = async () => {
  const calendar = google.calendar({
    version: 'v3',
    auth: oauth2Client,
  });

  const eventName = process.argv[2]; // コマンドライン引数からイベント名を取得

  try {
    const response = await calendar.events.list({
      calendarId: googleCalendarID,
      q: eventName, // イベント名で検索
      singleEvents: true,
      orderBy: 'startTime',
    });
    const events = response.data.items;
    if (events) {
      console.log('Upcoming events:');
      const events = response.data.items as calendar_v3.Schema$Event[];
      events.map((event: calendar_v3.Schema$Event) => {
        const start =
          (event.start?.dateTime as string) || (event.start?.date as string);
        const end =
          (event.end?.dateTime as string) || (event.end?.date as string);
        const timeStr = getTimeStr(start, end);
        console.log(
          `${convertToJapaneseDateFormat(
            parseISO(start),
            'yyyy年M月d日(E)'
          )} : ${timeStr}`
        );
      });
      if (events.length > 10) {
        console.log('スケジュール数が10件を超えています。');
      }
    } else {
      console.log('No upcoming events found.');
    }
  } catch (error) {
    console.log(error);
  }
};

const isFullDay = (start: Date, end: Date) => {
  return isSameHour(start, 9) && isSameHour(end, 19);
};

const convertToJapaneseDateFormat = (
  date: Date,
  formatStr: string,
  locale: Locale = ja
) => {
  return format(date, formatStr, { locale });
};

const formatTime = (date: Date) => {
  return convertToJapaneseDateFormat(date, 'HH:mm');
};

const getTimeStr = (start: string, end: string) => {
  if (start === end) {
    return '終日';
  } else {
    const convertedStartTime = parseISO(start);
    const convertedEndTime = parseISO(end);

    if (isFullDay(convertedStartTime, convertedEndTime)) {
      return '終日';
    } else {
      const startTimeStr = formatTime(convertedStartTime);
      const endTimeStr = isSameHour(convertedEndTime, 19)
        ? ''
        : `～${formatTime(convertedEndTime)}`;
      return `${startTimeStr}${endTimeStr}`;
    }
  }
};

if (googleAccessToken && googleRefreshToken) {
  oauth2Client.setCredentials({
    access_token: googleAccessToken,
    refresh_token: googleRefreshToken,
  });
  listEvents();
} else {
  getAccessToken(oauth2Client);
}
