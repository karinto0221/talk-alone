# Web版アーキテクチャ

## 方針

- React + TypeScript + Viteの静的成果物だけで動作する。
- 実行時にバックエンド、DB、外部API、AI、認証を使用しない。
- ユーザーデータと設定をサーバー・ブラウザストレージへ永続化しない。
- お題、コメント、ヒントはJavaScriptへ静的に同梱する。
- PCとスマートフォンのブラウザを同じ成果物で提供する。

## 実行構成

```text
Browser
└── React + TypeScript
    ├── practice: 内蔵カテゴリ・お題・ヒント、タイマー、MediaRecorder
    ├── streamer: 内蔵コメント・ラジオネーム、タイマー
    ├── reflex: 内蔵コメント・例えツッコミ生成
    ├── i18n: 日本語・英語の画面と練習コンテンツ
    └── result: メモリ上の録音再生とブラウザダウンロード
```

画面遷移はHashRouterを使用する。CloudFrontやS3にパスごとのルーティング設定を要求しない。

## AWS配信構成

```text
User
  │ HTTPS
  ▼
CloudFront
  │ Origin Access Control
  ▼
Private S3 bucket
```

- S3はBlock Public Accessを有効にし、直接公開しない。
- CloudFrontだけがOrigin Access Controlを通じてS3オブジェクトを取得できる。
- CloudFrontはHTTPをHTTPSへリダイレクトする。
- セキュリティヘッダーと`Permissions-Policy: microphone=(self)`を付与する。
- 独自ドメインを使用しない場合はCloudFront標準ドメインを利用する。
- EC2、ALB、Lambda、API Gateway、RDS、Route 53は必須ではない。

## データ

- 日本語・英語のお題、ヒント、配信コメント、ユーザー名をTypeScriptの静的データとしてバンドルする。
- 例えツッコミのお題は静的な語句セットからブラウザ上で生成する。
- 練習履歴、録音履歴、設定、アカウントを保存しない。
- 画面言語と練習言語はReact Contextのメモリ上だけで管理する。
- 3分スピーチの録音Blobと結果はReact Contextに1件だけ保持する。
- ページ再読み込み、画面離脱、タブ終了で一時データは破棄される。

## 録音と権限

- `navigator.mediaDevices.getUserMedia`と`MediaRecorder`を使用する。
- 公開環境ではHTTPSが必要。開発時の`localhost`はSecure Contextとして扱われる。
- マイク拒否、非対応、取得失敗時も録音なしで練習を継続する。
- 録音ファイル保存はBlob URLと`download`属性によるブラウザダウンロードを使用する。
- 録音音声をS3や外部サービスへアップロードしない。

## レスポンシブ方針

- 最小幅320pxからPCのワイド画面まで対応する。
- 760px以下では2カラムを1カラムへ切り替える。
- 520px以下では装飾用タイマープレビューを省略し、主要操作を優先する。
- スマートフォンではフォーム文字サイズを16px以上にし、iOS Safariの入力時ズームを避ける。
- タッチ操作の主要ボタンは高さ48px以上とする。
- iPhoneのSafe Areaと動的ビューポート単位`dvh`を考慮する。

## ビルドとデプロイ

- `npm run build`で`frontend/dist/`へ静的ファイルを生成する。
- `infra/cloudformation.yaml`で非公開S3とCloudFrontを作成する。
- `scripts/deploy-web.sh`でS3同期とCloudFront invalidationを行う。
- ハッシュ付きアセットは長期キャッシュし、`index.html`はキャッシュしない。
