# talk-alone web

スマートフォンとPCのブラウザで使える、配信・スピーチ練習Webアプリです。

React + TypeScript + Viteで生成した静的ファイルだけで動作します。バックエンド、データベース、外部API、AI、認証、ユーザーデータ保存は使用しません。

## 機能

- 3分スピーチ
  - スタンダードまたは1単語のお題
  - ランダムまたは10ジャンルから指定
  - 3分タイマー、補助ヒント、マイク録音
  - 終了後の再生と端末へのファイルダウンロード
- 配信練習
  - 内蔵コメントがランダムに流れる
  - コメント頻度と1〜60分の練習時間を指定
- コメント返し練習
- 例えツッコミ練習
- 日本語 / 英語の画面・練習コンテンツ

録音はブラウザのメモリ上に一時保持されます。サーバーへ送信されず、ユーザーがダウンロードした音声だけが端末に残ります。

## 構成

```text
ブラウザ（スマートフォン / PC）
        │ HTTPS
        ▼
Amazon CloudFront
        │ Origin Access Control
        ▼
非公開S3バケット
        │
        └── Viteで生成したHTML / CSS / JavaScript
```

```text
talk-alone/
├── frontend/                 # React + TypeScript + Vite
├── infra/cloudformation.yaml # S3 + CloudFront
├── scripts/deploy-web.sh     # ビルド済みファイルの配信
└── docs/                     # 実装済み仕様
```

Tauri、Rust、EC2、Lambda、API Gateway、RDSは使用しません。

## 開発環境

- Node.js 20以上
- npm

## セットアップ

```bash
npm install
npm run dev
```

`http://localhost:5173`を開きます。`localhost`ではブラウザのマイク録音を利用できます。

## 検証

```bash
npm run typecheck
npm test
npm run build
```

本番用の静的成果物は`frontend/dist/`へ生成されます。

## AWS環境の作成

AWS CLIの認証を済ませ、世界で一意なS3バケット名を決めて実行します。

```bash
aws cloudformation deploy \
  --stack-name talk-alone-web \
  --template-file infra/cloudformation.yaml \
  --parameter-overrides SiteBucketName=YOUR_UNIQUE_BUCKET_NAME
```

外部公開されないS3バケットと、HTTPSで配信するCloudFront Distributionが作成されます。CloudFormationの出力`WebsiteUrl`が公開URLです。独自ドメインは必須ではありません。

## デプロイ

```bash
TALK_ALONE_STACK_NAME=talk-alone-web npm run deploy:web
```

デプロイスクリプトは、ビルド、S3同期、`index.html`のキャッシュ抑止、CloudFrontキャッシュ無効化を実行します。AWS CLIでProfileを指定する場合は、通常どおり`AWS_PROFILE`を設定してください。

## HTTPSと録音

公開環境でのマイク取得にはHTTPSが必要です。CloudFrontの標準ドメインは最初からHTTPSで利用できます。HTTPのS3 Website Endpointは使用しません。

## 独自ドメインを追加する場合

任意でRoute 53などにドメインを登録し、us-east-1のACM証明書とCloudFrontのAlternate domain nameを設定します。独自ドメインを使わない限り、Route 53とACMの追加設定は不要です。

## 対応確認対象

- iPhone: 最新のSafari
- Android: 最新のChrome
- PC: 最新のChrome、Edge、Safari

録音形式、マイク権限、ファイル保存時の表示はOSとブラウザによって異なります。公開前に各実機で、マイク許可、録音、再生、ダウンロードを確認してください。
