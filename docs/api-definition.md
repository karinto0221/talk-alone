# API定義

ベースパスは `/api`。認証は不要。ValidationPipeで未定義フィールドを除去し、入力型を変換する。

## GET /api/health

- 用途: 稼働確認
- 200: `{ "status": "ok", "app": "talk-alone" }`

## GET /api/categories

- 用途: ジャンル一覧
- 200: `Category[]`。`displayOrder`昇順。

## GET /api/topics/random

- 用途: ランダムなお題取得
- AIキー設定時はランダム選択したジャンルを基にAI生成する。失敗・未設定時は内蔵データを返す。
- 200: `{ "text": string, "categoryId": string, "categoryName": string }`
- 404: ジャンルマスタが空の場合。

## POST /api/topics/help

- 用途: お題に対するヒント質問の取得
- Request: `{ "topic": string(1..200), "categoryId": CategoryId }`
- 200: `{ "question": string }`
- 400: 入力検証エラー。
- 404: ジャンルが存在しない場合。
- 副作用: なし。

## POST /api/speeches

- 用途: 完了したスピーチの保存
- Request: `{ "topic": string(1..200), "categoryId": CategoryId, "durationSeconds": integer(1..180), "helpCount": integer(0..50) }`
- 201: `{ id, topic, categoryId, categoryName, durationSeconds, helpCount, completedAt }`
- 400: 入力検証エラー。
- 404: ジャンルが存在しない場合。
- 副作用: speechesへ1件追加。

## GET /api/speeches/analytics

- 用途: 分析データ取得
- 200: `{ totalSessions, averageSeconds, bestSeconds, categoryStats, monthlyStats, recentSpeeches }`
- `categoryStats`: ジャンル名、色、平均秒数、件数。平均秒数降順。
- `monthlyStats`: 直近6か月。古い月から新しい月の順。
- `recentSpeeches`: 新しい順の最大20件。

## 共通エラー

NestJS標準形式 `{ statusCode, message, error }` を返す。内部例外、DB接続情報、AI APIキーは返さない。
