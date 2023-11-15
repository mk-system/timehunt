import { google } from 'googleapis';
import readline from 'readline';
import { getEnv } from "./lib/env";
const { googleClientID, googleClientSecret } = getEnv();

const CLIENT_ID = googleClientID;
const CLIENT_SECRET = googleClientSecret;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const REDIRECT_URL = 'urn:ietf:wg:oauth:2.0:oob';
const SCOPE = ['https://www.googleapis.com/auth/webmasters'];

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAccessToken = (oauth2Client: any) => {
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
  });
};

getAccessToken(oauth2Client);
