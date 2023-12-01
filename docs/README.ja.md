# timehunt

- Googleカレンダーから予定を取得して表示するアプリです。
- 動作にはNode.jsが必要です。
- このアプリはMITライセンスでリリースされています。LICENSE.txtを参照してください。


## 使用方法

### 環境設定

```.env
GOOGLE_CLIENT_ID="(Google Cloud Consoleから取得してください)"
GOOGLE_CLIENT_SECRET="(Google Cloud Consoleから取得してください)"
GOOGLE_ACCESS_TOKEN="(本アプリケーションの最初の実行時に取得できます)"
GOOGLE_REFRESH_TOKEN="(本アプリケーションの最初の実行時に取得できます)"
GOOGLE_CALENDAR_ID="(ご自身のGoogleカレンダーのカレンダーIDを貼り付けてください)"
```

### 実行コマンド

```bash
npm i -g pnpm
pnpm i
pnpm run hunt "会議"
```

### 実行結果

```bash
Upcoming events:
2023年11月29日(水) : 15:00～16:00
2023年12月6日(水) : 15:00～16:00
2023年12月13日(水) : 15:00～16:00
2023年12月20日(水) : 15:00～16:00
...
```