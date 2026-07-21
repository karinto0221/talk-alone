# AWS EC2への初回デプロイ

## 前提構成

- 1台のEC2上でDocker Composeを実行する。
- Elastic IPをEC2へ割り当て、`http://<Elastic-IP>` でアクセスする。
- HTTPSは現在の要件に含めない。
- セキュリティグループのTCP 80は利用者の送信元IPだけ許可する。
- 3000、5432、5434番はインターネットへ公開しない。

## 配置と起動

1. EC2へソースを配置する。
2. `.env.example` をルートの `.env` へコピーし、DBパスワードと必要なAI設定を変更する。
3. `docker compose up -d --build` を実行する。
4. `docker compose ps` と `http://<Elastic-IP>/api/health` で稼働確認する。

frontendのNginxは `/api/` を `backend:3000` へ転送し、`/` はReactの静的ファイルを返す。SPAの直接リロードは `try_files $uri $uri/ /index.html` で処理する。

## HTTP利用上の注意

通信は暗号化されないため、公衆Wi-Fiや広い送信元範囲では使用しない。将来利用者を増やす場合はドメイン、TLS証明書、認証を追加する。
