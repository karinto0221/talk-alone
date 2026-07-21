# talk-alone 開発ルール

1. 画面変更時は `docs/screen-design.md` を同時に更新する。
2. DB変更時は `docs/db-design.md` を同時に更新する。
3. API変更時は `docs/api-definition.md` を同時に更新する。
4. ドキュメントには理想像ではなく、実装済みの挙動を書く。
5. 同じ性質のコードは同じ構成、命名、エラー処理に揃える。
6. 新構成を導入した場合、同じ性質の既存コードも同じタスクで移行する。
7. 新旧2種類の実装方式を理由なく残さない。
8. ControllerはHTTP境界、Serviceはユースケース、Repositoryは永続化、Adapterは外部I/Oを担当する。
9. フロントエンドのAPI通信は `apiClient`、ドメインAPI、React Hookの3層を維持する。
10. secretや実データをコミットしない。DB変更は必ずマイグレーションで管理する。
