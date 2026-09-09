#!/usr/bin/env bash
# Apply pending migrations to the production database, after a forced export.
# The only sanctioned way to migrate production. Refuses to run if the export
# fails. Reads DATABASE_URL from .env.production.local without printing it.
set -euo pipefail
cd "$(dirname "$0")/.."
echo "1/3 exporting the log first"
scripts/export-log.sh
echo "2/3 pending migrations:"
ls drizzle/*.sql
env_file=".env.production.local"
url=$(grep -E '^DATABASE_URL=' "$env_file" | head -1 | cut -d= -f2- | tr -d '"')
[[ -n "$url" ]] || { echo "DATABASE_URL not found in $env_file" >&2; exit 1; }
echo "3/3 applying with drizzle-kit"
DATABASE_URL="$url" pnpm exec drizzle-kit migrate
echo "done; verify with: scripts/db.sh -c '\\dt'"
