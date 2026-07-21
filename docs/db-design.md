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

初期データとして `daily`、`favorites`、`memories`、`imagination`、`values`、`society` の6件を登録する。

## speeches

| カラム | 型 | 制約 | 内容 |
|---|---|---|---|
| id | uuid | PK, `gen_random_uuid()` | スピーチID |
| topic | varchar(200) | NOT NULL | お題 |
| category_id | varchar(32) | FK, NOT NULL | categories.id |
| duration_seconds | smallint | NOT NULL, 1〜180 | スピーチ秒数 |
| help_count | smallint | NOT NULL, 0以上, default 0 | ヒント利用回数 |
| completed_at | timestamptz | NOT NULL, default now() | 完了日時 |

- `category_id`削除時はRESTRICT。
- `completed_at DESC` に履歴取得用インデックスを持つ。
- `(category_id, completed_at DESC)` にジャンル集計・履歴用複合インデックスを持つ。

## マイグレーション履歴

| ID | 内容 |
|---|---|
| 1721548800000-InitialSchema | 2テーブル、制約、インデックス、ジャンル初期データを作成 |
