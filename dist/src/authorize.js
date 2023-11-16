"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const google_auth_library_1 = require("google-auth-library");
const readline_1 = __importDefault(require("readline"));
const env_1 = require("./lib/env");
const { googleClientID, googleClientSecret } = (0, env_1.getEnv)();
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const REDIRECT_URL = 'urn:ietf:wg:oauth:2.0:oob';
const SCOPE = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.readonly',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar.events.readonly',
    'https://www.googleapis.com/auth/calendar.settings.readonly',
    'https://www.googleapis.com/auth/calendar.addons.execute'
];
const oauth2Client = new google_auth_library_1.OAuth2Client(googleClientID, googleClientSecret, REDIRECT_URL);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAccessToken = (oauth2Client) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPE,
    });
    console.log('右記のURLをブラウザで開いてください: ', url);
    rl.question('表示されたコードを貼り付けてください: ', (code) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        oauth2Client.getToken(code, (err, tokens) => {
            console.log('トークンが発行されました');
            console.log(tokens);
            console.log('上記の情報を大切に保管してください');
        });
        rl.close();
    });
};
getAccessToken(oauth2Client);
