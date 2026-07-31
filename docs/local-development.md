# ローカル開発

## 前提

- Node.js 20以上
- npm
- Docker / Docker Compose

## セットアップ

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env
npm install
docker compose up -d db
npm run migration:run --workspace backend
npm run dev
```

フロントエンドは `http://localhost:5173`、APIは `http://localhost:3100/api`、DBは `localhost:5434` を使用する。

## 環境変数

- ルートの `.env` はDocker ComposeとNestJSローカル起動で共通利用する。ComposeはDB初期化とbackendコンテナの両方へ同じDB名・ユーザー・パスワードを渡す。
- frontendの `VITE_API_BASE_URL` はViteのビルド時に埋め込まれる。変更後は再ビルドが必要。
- backendのDB・CORS・AI設定はNestJS起動時に読み込まれる。変更後はプロセス再起動が必要。
- `AI_API_KEY` は任意。未設定でも内蔵データでお題・ヒントは動作するが、リザルト画面のAI分析は利用できない。
- `AI_TRANSCRIPTION_MODEL` は音声文字起こし用モデル。未設定時は `gpt-4o-mini-transcribe` を使用する。

## DB操作

```bash
npm run migration:run --workspace backend
npm run migration:revert --workspace backend
```

DBスキーマを変更した場合はマイグレーション、Entity、`docs/db-design.md`を同じ変更で更新する。

## 検証

```bash
npm run typecheck
npm test
npm run build
```
