#!/usr/bin/env bash
# Wipe the production log for launch: every player, match, deletion and
# restore, with the id sequences restarted at 1. Exports the log first and
# refuses to run without the word RESET typed at the prompt.
#   scripts/reset-prod.sh
set -euo pipefail
cd "$(dirname "$0")/.."
echo "This erases ALL production data. Current counts:"
scripts/db.sh -At -v ON_ERROR_STOP=1 -c "select 'players '||count(*) from players union all select 'matches '||count(*) from matches union all select 'deletions '||count(*) from deletions union all select 'restores '||count(*) from restores"
echo "Exporting the log to the backup repo first."
scripts/export-log.sh
read -r -p "Type RESET to continue: " word
[[ "$word" == "RESET" ]] || { echo "aborted"; exit 1; }
scripts/db.sh -v ON_ERROR_STOP=1 -q -c "truncate restores, deletions, matches, players restart identity cascade"
echo "done; the next player and match are #1"
scripts/db.sh -At -c "select 'players '||count(*) from players union all select 'matches '||count(*) from matches"
