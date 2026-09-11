# talk-alone desktop

Windows / macOS向けの、完全オフラインで動作する買い切り型の配信・スピーチ練習アプリです。

## v1.0の機能

- 3分スピーチ
  - スタンダードまたは1単語のお題
  - ランダムまたは10ジャンルから指定
  - 3分タイマーと補助ヒント
  - マイク録音、終了後の再生、任意の場所へのファイル保存
- 配信練習
  - 内蔵コメントが1〜3分間隔でランダムに流れる
  - 1〜60分の練習時間を設定可能
- コメント返し練習
  - 内蔵コメントへ声で返し、NEXTで次へ進む
- 例えツッコミ練習
  - 3形式のランダムなお題へ声で返し、NEXTで次へ進む

サーバー、データベース、外部API、AI、認証、履歴保存、自動アップデートは使用しません。お題とコメントはアプリへ同梱され、録音は現在のリザルト画面だけに一時保持されます。

## 構成

```text
talk-alone/
├── frontend/     # React + TypeScript + Vite
├── src-tauri/    # Tauri 2のデスクトップシェル
├── docs/         # 実装済み仕様
└── package.json
```

## 開発環境

- Node.js 20以上
- npm
- Rust stable
- macOS: Xcode Command Line Tools
- Windows: Microsoft C++ Build Tools、Microsoft Edge WebView2

Rustの導入方法とOS別の前提条件は、[Tauri公式のPrerequisites](https://v2.tauri.app/start/prerequisites/)を参照してください。

## セットアップ

```bash
npm install
```

`.env`、Docker、PostgreSQLの準備は不要です。

## デスクトップアプリを開発起動

```bash
npm run tauri:dev
```

UIだけをブラウザで確認する場合は、次を実行して `http://127.0.0.1:5173` を開きます。

```bash
npm run dev
```

ブラウザ確認時の録音保存は通常のダウンロードとして動作します。Tauri内ではOS標準の保存ダイアログを使用します。

## 検証

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## 配布ビルド

ビルドは対象OS上で実行します。macOS上ではmacOS用、Windows上ではWindows用の成果物を生成します。

```bash
npm run tauri:build
```

成果物は `src-tauri/target/release/bundle/` 以下へ生成されます。

### macOS

Apple Silicon専用版を生成する場合:

```bash
npm run tauri:build -- --bundles app,dmg
```

Intel MacとApple Silicon Macの両方で動くUniversal版を生成する場合は、初回だけIntel向けRustターゲットを追加してからビルドします。

```bash
rustup target add x86_64-apple-darwin
npm run tauri:build:macos:universal
```

Universal版の成果物は `src-tauri/target/universal-apple-darwin/release/bundle/` 以下へ生成されます。試用配布では、生成された1つのDMGをIntel Mac・Apple Silicon Macのどちらにも共有できます。

### Windows

Windows上でビルドする場合:

```powershell
npm run tauri:build -- --bundles nsis,msi
```

Apple Silicon MacからWindows x64用NSISインストーラーをクロスビルドする場合は、初回だけ以下を準備します。

```bash
brew install makensis llvm
rustup target add x86_64-pc-windows-msvc
cargo install --locked cargo-xwin
```

以降は次のコマンドで生成できます。

```bash
npm run tauri:build:windows:cross
```

成果物は `src-tauri/target/x86_64-pc-windows-msvc/release/bundle/nsis/` 以下へ生成されます。macOSからのクロスビルドはTauri上で実験的サポートのため、配布前にWindows実機でインストール、マイク許可、録音、再生、保存を確認してください。MSIはWindows上でのみ生成できます。

## 販売前のTODO

以下はアプリ機能とは別の配布作業です。このリポジトリには証明書や販売基盤を含めません。

- macOS: Apple Developer Programへの加入、Developer ID署名、Hardened Runtime、notarization、staple
- Windows: コード署名証明書の取得、実行ファイルとインストーラーへの署名、SmartScreen警告の実機確認
- 各OSの実機で、初回マイク許可、録音、再生、保存先選択、インストール/アンインストールを確認
- 製品用アイコン、利用規約、販売ページ、決済・購入者へのファイル配布方法を準備
- Windows成果物はWindows環境、macOS成果物はmacOS環境で継続的に生成・保管する
