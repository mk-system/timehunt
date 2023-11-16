import { google, calendar_v3 } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import moment from 'moment';
import { getEnv } from "./lib/env";

const {
  googleClientID,
  googleClientSecret,
  googleAccessToken,
  googleRefreshToken,
  googleCalendarID
} = getEnv();
const oauth2Client = new OAuth2Client(googleClientID, googleClientSecret);
oauth2Client.setCredentials({
  access_token: googleAccessToken,
  refresh_token: googleRefreshToken,
});
const calendar = google.calendar({
  version: "v3",
  auth: oauth2Client
});

const eventName = process.argv[2]; // コマンドライン引数からイベント名を取得

async function listEvents() {
  try {
    const response = await calendar.events.list({
      calendarId: googleCalendarID,
      q: eventName, // イベント名で検索
    });
    const events = response.data.items;
    if (events) {
      console.log('Upcoming events:');
      events.map((event: calendar_v3.Schema$Event) => {
        const start = event.start?.dateTime || event.start?.date; // 開始時間
        const end = event.end?.dateTime || event.end?.date; // 終了時間
        const timeStr = getTimeStr(start, end);
        console.log(`${moment(start).format('MM月 DD日 (dddd)')}⋅${timeStr}`);
      });
    } else {
      console.log('No upcoming events found.');
    }
  } catch (error) {
    console.log(error);
  }
}

function getTimeStr(start: string | null | undefined, end: string | null | undefined): string {
  if (start === end) {
    return '終日';
  } else {
    const startMoment = moment(start);
    const endMoment = moment(end);
    if (startMoment.format('HH:mm') === '09:00' && endMoment.format('HH:mm') === '19:00') {
      return '終日';
    } else if (endMoment.format('HH:mm') === '19:00') {
      return startMoment.format('HH:mm') + '～';
    } else {
      return startMoment.format('HH:mm') + '～' + endMoment.format('HH:mm');
    }
  }
}

listEvents();