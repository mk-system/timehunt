# schedule-checker

- Googleカレンダーから予定を取得して表示するアプリです。
- 動作にはNode.jsが必要です。

```.env
GOOGLE_CLIENT_ID="(Google Cloud Consoleから取得してください)"
GOOGLE_CLIENT_SECRET="(Google Cloud Consoleから取得してください)"
GOOGLE_API_TOKEN="(Google Cloud Consoleから取得してください)"
GOOGLE_ACCESS_TOKEN="(authorize.jsを実行して取得してください)"
GOOGLE_REFRESH_TOKEN="(authorize.jsを実行して取得してください)"
GOOGLE_CALENDAR_ID="(ご自身のGoogle CalendarのカレンダーIDを貼り付けてください)"
```

```zsh
npm i -g pnpm
pnpm i
pnpm run build
node dist/src/authorize.js
node dist/src/index.js --"A様打ち合わせ?"
```