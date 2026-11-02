#!/bin/zsh
# Publish the music portfolio to Cloudflare Pages.
#
# Deploys from a staged folder rather than the repo root, so repository
# plumbing — .github, .gitattributes — is never uploaded with the site. The
# first deploy shipped the Actions workflow by accident that way.
#
# Account: bibomusicom@gmail.com (CF_TOKEN_BIBO). Project: tupini-music.
#
# Usage: ./deploy.sh [--stage-only]

set -euo pipefail
cd "${0:A:h}"

STAGE="build/site"
echo "--- staging"
rm -rf "$STAGE"
mkdir -p "$STAGE"
# Only what the site actually serves.
cp index.html "$STAGE/"
for dir in css js images audio; do
  [[ -d "$dir" ]] && cp -R "$dir" "$STAGE/"
done
echo "    $(find "$STAGE" -type f | wc -l | tr -d ' ') files, $(du -sh "$STAGE" | cut -f1)"

if [[ "${1:-}" == "--stage-only" ]]; then
  echo "--- deploy skipped (--stage-only)"
  exit 0
fi

echo "--- deploy"
TOKEN_FILE="$HOME/.claude_personal/.cloudfare_tokens"
if [[ ! -f "$TOKEN_FILE" ]]; then
  echo "ERROR: $TOKEN_FILE missing — cannot publish" >&2
  exit 1
fi

# Extracted into the environment, never printed. The account is inferred from
# the token's scope rather than hardcoded — this repository is public.
export CLOUDFLARE_API_TOKEN=$(awk -F'=' '/^CF_TOKEN_BIBO=/{gsub(/[ \t]/,"",$2);print $2}' "$TOKEN_FILE")
npx --yes wrangler@latest pages deploy "$STAGE" \
  --project-name=tupini-music \
  --branch=main \
  --commit-dirty=true
unset CLOUDFLARE_API_TOKEN

echo "--- done: https://tupini-music.pages.dev"
