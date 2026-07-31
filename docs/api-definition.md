# API定義

ベースパスは `/api`。認証は不要。ValidationPipeで未定義フィールドを除去し、入力型を変換する。

## GET /api/health

- 用途: 稼働確認
- 200: `{ "status": "ok", "app": "talk-alone" }`

## GET /api/categories

- 用途: ジャンル一覧
- 200: `Category[]`。`displayOrder`昇順。

## GET /api/topics/random

- 用途: 指定条件に基づくランダムなお題取得
- Query: `categoryId?: string(1..32)`。両モードで使用し、省略した場合はDBのジャンルマスタからランダムに選択する。
- Query: `mode?: "standard" | "word"`。省略時は `standard`。`word` は説明や句読点を含まない1単語だけを返す。
- スタンダードは選択したジャンルを基に文章または問いをAI生成する。ワードは同じジャンルを基に1単語をAI生成する。
- AI失敗・未設定時は、選択されたジャンルとモードに対応する内蔵データから返す。
- AIがワードモードの形式に違反した場合も内蔵データへフォールバックする。
- 200: `{ "text": string, "categoryId": string, "categoryName": string, "mode": "standard" | "word" }`
- 400: ジャンルIDの形式またはモードが不正な場合。
- 404: 指定ジャンルがDBに存在しない、または利用できるジャンルがない場合。

## POST /api/topics/help

- 用途: お題に対するヒント質問の取得
- Request: `{ "topic": string(1..200), "categoryId": CategoryId }`
- 200: `{ "question": string }`
- 400: 入力検証エラー。
- 404: ジャンルが存在しない場合。
- 副作用: なし。

## POST /api/speeches

- 用途: 完了したスピーチの保存
- Request: `{ "topic": string(1..200), "categoryId": CategoryId, "mode": "standard" | "word", "durationSeconds": integer(1..180), "helpCount": integer(0..50) }`
- 201: `{ id, topic, categoryId, categoryName, mode, durationSeconds, helpCount, completedAt }`
- 400: 入力検証エラー。
- 404: ジャンルが存在しない場合。
- 副作用: speechesへ1件追加。

## POST /api/speeches/:id/analysis

- 用途: 保存済みスピーチに対応する一時録音を文字起こしし、AIフィードバックを取得する。
- Path: `id` はスピーチ記録のUUID。
- Content-Type: `multipart/form-data`。
- Form: `audio`。最大10MB。対応形式はwebm、ogg、mp4/m4a、mp3/mpeg、wav。
- 201: `{ transcript, summary, strengths: string[], improvements: string[], nextChallenge }`
- 分析対象は文字起こしから判断できる話の内容と構成。声質、音量、発音などは評価しない。
- 400: ファイルがない、空、上限超過、または非対応形式の場合。
- 404: スピーチ記録が存在しない場合。
- 503: AI未設定、文字起こし失敗、またはフィードバック生成失敗の場合。
- 音声ファイルと分析結果はDB・サーバーディスクへ保存しない。

## GET /api/speeches/analytics

- 用途: 分析データ取得
- Query: `mode?: "all" | "standard" | "word"`。省略時は `all`。
- 200: `{ mode, totalSessions, averageSeconds, bestSeconds, categoryStats, monthlyStats, recentSpeeches }`
- `all`: 全モードの概要と月別集計。`categoryStats` と `recentSpeeches` は空配列。
- `standard`: スタンダードだけを対象に集計。
- `word`: ワードだけを対象に、選択またはランダムで決定したジャンル別に集計。
- `categoryStats`: ジャンル名、色、平均秒数、件数。平均秒数降順。
- `monthlyStats`: 直近6か月。古い月から新しい月の順。
- `recentSpeeches`: 新しい順の最大20件。

## 共通エラー

NestJS標準形式 `{ statusCode, message, error }` を返す。内部例外、DB接続情報、AI APIキーは返さない。アップロード上限超過時はmultipart処理の400系エラーを返す。
