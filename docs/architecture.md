# デスクトップ版アーキテクチャ

## 方針

- 実行時にサーバー、DB、ネットワーク接続を必要としない。
- ユーザーデータと設定を永続化しない。
- 自動アップデート、外部API、テレメトリーを持たない。
- ネイティブ機能は録音ファイルの保存先選択と書き込みだけに限定する。

## 実行構成

```text
Tauri 2
├── WebView
│   └── React + TypeScript
│       ├── practice: 内蔵カテゴリ・お題・ヒント、タイマー、MediaRecorder
│       ├── streamer: 内蔵コメント・ラジオネーム、タイマー
│       ├── reflex: 内蔵コメント・例えツッコミ生成
│       └── result: メモリ上の録音再生と保存操作
└── Tauri plugins
    ├── dialog: OS標準の保存先選択
    └── fs: 選択されたファイルへの音声書き込み
```

## データ

- カテゴリ10件、スタンダードお題5,000件、ワード5,000件、ヒント2,000件相当、配信コメント5,000件、ラジオネーム5,000件をTypeScriptの静的データとしてバンドルする。
- 例えツッコミは静的な語句セットから2,380通りを組み合わせて実行時に生成する。
- 練習履歴、録音履歴、設定ファイル、キャッシュ用DBは作成しない。
- 3分スピーチの録音Blobと結果はReact Contextに1件だけ保持し、画面離脱またはプロセス終了で破棄する。

## ネットワークと権限

- フロントエンドにHTTPクライアントや`fetch`処理を持たない。
- Content Security Policyの`connect-src`はTauri IPCだけを許可する。
- macOSの`Info.plist`には録音用途のマイク説明を定義する。
- Tauri capabilityは保存ダイアログと、ダイアログで選択されたファイルへの書き込みだけを許可する。
- updater、HTTP、SQL、Store、認証関連プラグインは導入しない。

## ビルド

- Viteで生成した静的アセットをTauriバイナリへ埋め込む。
- macOS成果物はmacOS、Windows成果物はWindows上でビルドする。
- macOS版は`universal-apple-darwin`ターゲットを使用すると、Intel（x86_64）とApple Silicon（arm64）の両方を含む1つのUniversal Appとして生成できる。
- Windows x64版はWindows上でNSIS/MSIを生成できる。試用向けNSISのみ、macOS上から`cargo-xwin`を使ったクロスビルドにも対応するが、Windows実機検証は別途必要とする。
- コード署名・notarization・SmartScreen対策は販売者の証明書が必要なため、アプリ実装とは分離する。
