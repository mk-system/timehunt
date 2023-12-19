# timehunt

- Googleカレンダーから予定を取得して表示するアプリです。
- 動作にはNode.jsが必要です。
- このアプリはMITライセンスでリリースされています。LICENSE.txtを参照してください。


## 使用方法

### 環境設定

```.env
GOOGLE_CLIENT_ID="(Google Cloud Consoleから取得してください)"
GOOGLE_CLIENT_SECRET="(Google Cloud Consoleから取得してください)"
GOOGLE_CALENDAR_ID="(ご自身のGoogleカレンダーのカレンダーIDを貼り付けてください)"
LOCALE="('ja' or 'en')"
```

### 実行コマンド

```bash
npm i -g timehunt
timehunt hunt "meeting"
```

### 実行結果

```bash
2023年12月21日(木) : 13:00～14:00 or 15:00～16:00
2023年12月22日(金) : 終日
2024年01月05日(金) : 10:15～13:15
```