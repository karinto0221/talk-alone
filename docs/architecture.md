# Web版アーキテクチャ

## 方針

- React + TypeScript + Viteの静的成果物だけで動作する。
- 実行時にバックエンド、DB、外部API、AI、認証を使用しない。
- ユーザーデータと設定をサーバー・ブラウザストレージへ永続化しない。
- お題とコメントはJavaScriptへ静的に同梱する。
- PCとスマートフォンのブラウザを同じ成果物で提供する。

## 実行構成

```text
Browser
└── React + TypeScript
    ├── practice: 内蔵カテゴリ・お題、タイマー、MediaRecorder
    ├── streamer: 内蔵コメント・ラジオネーム、タイマー、Web Audio APIによる発話区間計測
    ├── reflex: 例え連想・組み合わせツッコミ生成、回答時間計測、チャレンジ動画生成
    ├── i18n: 日本語・英語の画面と練習コンテンツ
    └── result: メモリ上の録音再生、共有用画像生成、ブラウザダウンロード
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

- 日本語・英語のお題、配信コメント、ユーザー名をTypeScriptの静的データとしてバンドルする。
- 瞬発力のお題は静的な語句セットからブラウザ上で生成する。例え連想は「修飾表現＋形容詞」、組み合わせツッコミは「形容表現＋名詞」または「目的語＋助詞＋動詞」を使用する。
- 練習履歴、録音履歴、設定、アカウントを保存しない。
- v1で有効な言語は日本語のみとする。英語のUI文言、お題、コメントと切り替え処理は保持し、`ENABLED_APP_LANGUAGES`へ`en`を追加するとヘッダーの言語選択と英語コンテンツを再び有効化できる。
- 言語状態はReact Contextのメモリ上だけで管理する。
- 3分スピーチの録音Blobと結果はReact Contextに1件だけ保持する。
- 配信者と瞬発力の計測結果は各セッションのReact stateだけに保持する。
- 瞬発力チャレンジの動画Blobも結果画面のメモリ上だけに保持し、保存または共有をユーザーが選んだ場合のみ端末の機能へ渡す。
- 各モードの共有用画像はCanvas APIで結果画面を開いている間だけBlobとして生成し、保存または共有をユーザーが選んだ場合のみ端末の機能へ渡す。
- ページ再読み込み、画面離脱、タブ終了で一時データは破棄される。

## 録音と権限

- `navigator.mediaDevices.getUserMedia`と`MediaRecorder`を使用する。
- 瞬発力チャレンジではCanvas APIで縦9:16の練習画面を描画し、`canvas.captureStream`の映像とマイク音声を`MediaRecorder`で一時動画にする。カメラ映像は使用しない。
- 配信者モードでは`AudioContext`と`AnalyserNode`で音量を解析し、発話時間、無音時間、連続発話時間を算出する。音声Blobは生成しない。
- 配信者モード開始後の1.5秒間で環境音を測定し、そのセッションの発話判定基準を決める。
- 公開環境ではHTTPSが必要。開発時の`localhost`はSecure Contextとして扱われる。
- マイク拒否、非対応、取得失敗時も録音・発話分析なしで練習を継続する。
- 録音ファイル保存はBlob URLと`download`属性によるブラウザダウンロードを使用する。
- チャレンジ動画はBlob URLで再生・保存する。Web Share APIがファイル共有に対応する端末でのみ汎用の共有ボタンを表示し、特定SNSとの連携は行わない。
- 録音音声をS3や外部サービスへアップロードしない。
- チャレンジ動画もS3や外部サービスへ自動送信せず、結果画面離脱時にBlob URLを破棄する。
- 共有用リザルト画像も自動送信せず、結果画面離脱時にBlob URLを破棄する。
- 配信者モードの音声ストリームは終了時または画面離脱時に停止し、音量の集計値を含め外部へ送信しない。

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
- OGPの絶対URLはデプロイ時のCloudFormation `WebsiteUrl`を使用し、独自ドメイン利用時は`TALK_ALONE_PUBLIC_SITE_URL`で上書きする。
- ハッシュ付きアセットは長期キャッシュし、`index.html`はキャッシュしない。
