#!/usr/bin/env sh

set -eu

STACK_NAME="${TALK_ALONE_STACK_NAME:-talk-alone-web}"

if ! command -v aws >/dev/null 2>&1; then
  echo "AWS CLI is required." >&2
  exit 1
fi

BUCKET_NAME="$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --query "Stacks[0].Outputs[?OutputKey=='BucketName'].OutputValue" --output text)"
DISTRIBUTION_ID="$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --query "Stacks[0].Outputs[?OutputKey=='DistributionId'].OutputValue" --output text)"

if [ -z "$BUCKET_NAME" ] || [ -z "$DISTRIBUTION_ID" ]; then
  echo "Could not read deployment outputs from CloudFormation stack: $STACK_NAME" >&2
  exit 1
fi

npm run build

aws s3 sync frontend/dist/ "s3://$BUCKET_NAME" \
  --delete \
  --exclude index.html \
  --cache-control "public,max-age=31536000,immutable"

aws s3 cp frontend/dist/index.html "s3://$BUCKET_NAME/index.html" \
  --content-type "text/html; charset=utf-8" \
  --cache-control "no-cache, no-store, must-revalidate"

aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*"

echo "Deployment started. CloudFront may take a few minutes to update."

