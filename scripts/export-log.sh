#!/usr/bin/env bash
# Export every log table from the production database as JSON into the
# private backup repository and push it. Safe to run any time; used by the
# daily timer on Europa and by migrate-prod.sh before a migration.
#   scripts/export-log.sh            -> ~/ashdown-win-backups
#   BACKUP_DIR=/path scripts/export-log.sh
set -euo pipefail
cd "$(dirname "$0")/.."
dir=${BACKUP_DIR:-$HOME/ashdown-win-backups}
[[ -d "$dir/.git" ]] || { echo "backup repo missing at $dir (git clone andersbekkevard/ashdown-win-backups)" >&2; exit 1; }
stamp=$(date -u +%Y-%m-%dT%H%M%SZ)
# Export every table that exists; a table that a pending migration will add
# is simply not there yet.
tables=$(scripts/db.sh -At -v ON_ERROR_STOP=1 -c "select table_name from information_schema.tables where table_schema='public' and table_name not like '\_\_%' order by table_name")
[[ -n "$tables" ]] || { echo "no tables found" >&2; exit 1; }
meta="{\"exported_at\": \"$stamp\""
for t in $tables; do
  scripts/db.sh -At -v ON_ERROR_STOP=1 -c "select coalesce(json_agg(t order by t.id), '[]'::json) from \"$t\" t" > "$dir/$t.json"
  [[ -s "$dir/$t.json" ]] || { echo "empty export for $t" >&2; exit 1; }
  n=$(scripts/db.sh -At -v ON_ERROR_STOP=1 -c "select count(*) from \"$t\"")
  meta="$meta, \"$t\": $n"
done
echo "$meta}" > "$dir/meta.json"
git -C "$dir" add -A
if git -C "$dir" diff --cached --quiet; then
  echo "export $stamp: no change"
else
  git -C "$dir" commit -q -m "export $stamp" && git -C "$dir" push -q && echo "export $stamp: pushed"
fi
