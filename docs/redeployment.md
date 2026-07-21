# 再デプロイ

## 手順

1. `docker compose exec db pg_dump -U talk_alone talk_alone` でバックアップを取得する。
2. 新しいソースを配置する。
3. `docker compose build` を実行する。
4. `docker compose up -d` を実行する。backend起動時に未適用マイグレーションが実行される。
5. `/api/health`、スピーチ開始、履歴表示を確認する。

## ロールバック

- アプリだけの変更は以前のイメージまたはコミットへ戻し、再度 `docker compose up -d --build` を実行する。
- DB変更を含む場合は、マイグレーションのdownが安全であることを確認してrevertする。データ損失の可能性があればrevertせず、バックアップから別DBへ復元して切り替える。
- バックアップの確認前にvolumeを削除しない。
