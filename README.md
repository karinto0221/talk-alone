# talk-alone

選択した条件で出題されるお題について3分間話し、スピーチ時間をジャンル別・月別に記録する個人向けWebアプリです。

## 機能

- 両モードでジャンルをランダムまたは10件から指定してセッションを開始
- 文章・問いを出すスタンダードモードと、選択ジャンルに沿った1単語だけを出すワードモード
- セッション中にお題固有のヒント質問を表示
- 3分経過時の自動終了、任意のタイミングでの終了
- お題、ジャンル、時間、ヒント利用回数をPostgreSQLへ保存
- 総合・スタンダード・ワード別に、月別平均時間、ジャンル別平均時間、最近の履歴を表示
- AI API未設定時は内蔵データで動作

## 構成

```text
talk-alone/
├── backend/       # NestJS・TypeORM・ドメイン別Module
├── frontend/      # React・feature単位の画面構成
├── docs/          # 画面、DB、API、開発・運用設計
├── AGENTS.md      # 実装と設計書の同期ルール
└── docker-compose.yml
```

認証は実装していません。単一ユーザーがIPアドレスを直接開く利用形態を前提にしています。

## ローカル起動

Node.js 20以上、npm、Dockerが必要です。

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env
npm install
docker compose up -d db
npm run migration:run --workspace backend
npm run dev
```

- フロントエンド: http://localhost:5173
- API: http://localhost:3100/api/health
- PostgreSQL: localhost:5434

環境変数の詳細と起動方法は `docs/local-development.md` を参照してください。

## Dockerで一括起動

```bash
docker compose up --build
```

http://localhost で利用できます。バックエンドは起動前にマイグレーションを適用します。

## 設計上の前提

- HTTPSは初期要件に含めず、AWS EC2のHTTP 80番を特定の送信元IPだけに許可する。
- アカウント・認証・複数ユーザー識別は実装しない。
- AI API障害時は内蔵のお題とヒントへフォールバックする。
- Vite環境変数はビルド時、NestJS環境変数は起動時に反映される。

ルートの `.env` がDocker Composeとローカル起動の共通設定元です。旧ローカル版のJSON記録は `backend/data/legacy-speeches.json` に退避しており、PostgreSQLへは自動投入しません。

## 検証

```bash
npm run typecheck
npm test
npm run build
```
