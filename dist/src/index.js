"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const google_auth_library_1 = require("google-auth-library");
const moment_1 = __importDefault(require("moment"));
const env_1 = require("./lib/env");
const { googleClientID, googleClientSecret, googleAccessToken, googleRefreshToken, googleCalendarID } = (0, env_1.getEnv)();
const oauth2Client = new google_auth_library_1.OAuth2Client(googleClientID, googleClientSecret);
oauth2Client.setCredentials({
    access_token: googleAccessToken,
    refresh_token: googleRefreshToken,
});
const calendar = googleapis_1.google.calendar({
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
            events.map((event) => {
                const start = event.start?.dateTime || event.start?.date; // 開始時間
                const end = event.end?.dateTime || event.end?.date; // 終了時間
                const timeStr = getTimeStr(start, end);
                console.log(`${(0, moment_1.default)(start).format('MM月 DD日 (dddd)')}⋅${timeStr}`);
            });
        }
        else {
            console.log('No upcoming events found.');
        }
    }
    catch (error) {
        console.log(error);
    }
}
function getTimeStr(start, end) {
    if (start === end) {
        return '終日';
    }
    else {
        const startMoment = (0, moment_1.default)(start);
        const endMoment = (0, moment_1.default)(end);
        if (startMoment.format('HH:mm') === '09:00' && endMoment.format('HH:mm') === '19:00') {
            return '終日';
        }
        else if (endMoment.format('HH:mm') === '19:00') {
            return startMoment.format('HH:mm') + '～';
        }
        else {
            return startMoment.format('HH:mm') + '～' + endMoment.format('HH:mm');
        }
    }
}
listEvents();
