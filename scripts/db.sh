#!/usr/bin/env bash
# psql against the production Neon database.
#   scripts/db.sh                       interactive psql
#   scripts/db.sh -c "select count(*) from players"
#   scripts/db.sh < file.sql
# Reads DATABASE_URL from .env.production.local, created with
#   vercel env pull .env.production.local --environment=production
# Never prints the connection string.
set -euo pipefail
cd "$(dirname "$0")/.."
env_file=".env.production.local"
[[ -f "$env_file" ]] || { echo "missing $env_file; run: vercel env pull $env_file --environment=production" >&2; exit 1; }
url=$(grep -E '^DATABASE_URL=' "$env_file" | head -1 | cut -d= -f2- | tr -d '"')
[[ -n "$url" ]] || { echo "DATABASE_URL not found in $env_file" >&2; exit 1; }
exec psql "$url" "$@"
