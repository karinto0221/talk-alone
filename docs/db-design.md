# DB設計

PostgreSQL 16を使用し、TypeORMの `synchronize` は無効化する。変更はマイグレーションだけで適用する。

## ER関係

```text
categories 1 ─── n speeches
```

## categories

| カラム | 型 | 制約 | 内容 |
|---|---|---|---|
| id | varchar(32) | PK | 固定ジャンルID |
| name | varchar(64) | NOT NULL, UNIQUE | 表示名 |
| description | varchar(255) | NOT NULL | AIへのジャンル説明 |
| color | varchar(16) | NOT NULL | UI表示色 |
| display_order | smallint | NOT NULL | 表示順 |

初期データとして次の10件を登録する。

- ジャンル定義の正本はこのテーブルとする。
- API入力ではIDの文字列形式だけを検証し、利用可能なIDかどうかはこのテーブルの存在確認で判定する。
- フロントエンドの選択肢は `GET /api/categories` から取得し、固定のジャンル一覧を保持しない。

| ID | 表示名 |
|---|---|
| daily | 日常・暮らし |
| favorites | 好きなもの |
| memories | 思い出・経験 |
| imagination | もしも・想像 |
| values | 価値観・思考 |
| society | 社会・未来 |
| work_learning | 仕事・学び |
| relationships | 人間関係 |
| entertainment_culture | エンタメ・文化 |
| debate | 賛否・ディベート |

## speeches

| カラム | 型 | 制約 | 内容 |
|---|---|---|---|
| id | uuid | PK, `gen_random_uuid()` | スピーチID |
| topic | varchar(200) | NOT NULL | お題 |
| category_id | varchar(32) | FK, NOT NULL | categories.id |
| mode | varchar(16) | NOT NULL, `standard` / `word`, default `standard` | 出題モード |
| duration_seconds | smallint | NOT NULL, 1〜180 | スピーチ秒数 |
| help_count | smallint | NOT NULL, 0以上, default 0 | ヒント利用回数 |
| completed_at | timestamptz | NOT NULL, default now() | 完了日時 |

- `category_id`削除時はRESTRICT。
- `completed_at DESC` に履歴取得用インデックスを持つ。
- `(category_id, completed_at DESC)` にジャンル集計・履歴用複合インデックスを持つ。
- `(mode, completed_at DESC)` にモード別集計・履歴用複合インデックスを持つ。
- 既存レコードはマイグレーション時に `standard` として扱う。
- 両モードの `category_id` は、開始時にユーザーが選択したジャンル、またはDBマスタからランダムに決定したジャンルを保存する。

## マイグレーション履歴

| ID | 内容 |
|---|---|
| 1721548800000-InitialSchema | 2テーブル、制約、インデックス、ジャンル初期データを作成 |
| 1784620800000-AddPracticeCategories | 仕事・学び、人間関係、エンタメ・文化、賛否・ディベートの4ジャンルを追加 |
| 1784624400000-AddSpeechMode | speechesへ出題モードとモード別集計用インデックスを追加 |
