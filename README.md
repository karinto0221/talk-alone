# talk-alone web

スマートフォンとPCのブラウザで使える、配信・スピーチ練習Webアプリです。

React + TypeScript + Viteで生成した静的ファイルだけで動作します。バックエンド、データベース、外部API、AI、認証、ユーザーデータ保存は使用しません。v1の表示と練習コンテンツは日本語のみです。

## 機能

- 3分スピーチ
  - 内蔵されたお題からランダムに1つ出題
  - ランダムまたは10ジャンルから指定
  - 3分タイマーとマイク録音
  - 終了後の再生と端末へのファイルダウンロード
- 配信練習
  - 内蔵コメント1,000件がランダムに流れる
  - コメント頻度と1〜60分の練習時間を指定
  - マイクから発話時間、発話率、最長無音などを計測（音声ファイルは生成しない）
- 瞬発力トレーニング
  - 「例え連想」または「組み合わせツッコミ」
  - 5問 / 10問の時間制限なし練習
  - 5問・各10秒のチャレンジと縦9:16の一時動画録画
  - 結果で平均回答時間、最速、最長、問題別時間を表示
- 全モード共通
  - 練習結果を1200×630pxの共有用画像として端末内で生成
  - 画像のダウンロードと、対応端末でのOS共有

録音、チャレンジ動画、共有用画像はブラウザのメモリ上に一時保持されます。サーバーへ送信されず、ユーザーが明示的に保存したファイルだけが端末に残ります。マイクを利用できない場合も練習自体は続行できます。

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

テストでは、お題・単語・配信コメントの件数と重複、ランダム選択、瞬発力のお題生成、結果集計に加えて、日本語のお題に空文字・前後空白・改行・既知の水増し定型文が含まれていないことを確認します。

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

デプロイスクリプトは、ビルド、S3同期、`index.html`のキャッシュ抑止、CloudFrontキャッシュ無効化を実行します。OGPのURLにはCloudFormationの`WebsiteUrl`が使われます。AWS CLIでProfileを指定する場合は、通常どおり`AWS_PROFILE`を設定してください。

独自ドメインを使う場合は、OGPのURLも独自ドメインへ合わせてデプロイします。

```bash
TALK_ALONE_PUBLIC_SITE_URL=https://example.com npm run deploy:web
```

## OGP・favicon・制作者リンク

- OGP画像: `frontend/public/og-image.png`（編集元は`og-image.svg`）
- アプリアイコン・favicon: `frontend/public/app-icon.png`
- 制作者情報: `frontend/src/config/creator.ts`

`creator.ts`の表示名、X、YouTube URLは初期状態では空です。必要な項目を設定すると、画面下部に制作者リンクが表示されます。空のままの項目は表示されません。

## HTTPSと録音

公開環境でのマイク取得にはHTTPSが必要です。CloudFrontの標準ドメインは最初からHTTPSで利用できます。HTTPのS3 Website Endpointは使用しません。

## 独自ドメインを追加する場合

任意でRoute 53などにドメインを登録し、us-east-1のACM証明書とCloudFrontのAlternate domain nameを設定します。独自ドメインを使わない限り、Route 53とACMの追加設定は不要です。

## 対応確認対象

- iPhone: 最新のSafari
- Android: 最新のChrome
- PC: 最新のChrome、Edge、Safari

録音形式、マイク権限、ファイル保存時の表示はOSとブラウザによって異なります。公開前に各実機で、マイク許可、録音、再生、ダウンロードを確認してください。
