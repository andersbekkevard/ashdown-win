#!/usr/bin/env bash
# Hard-delete a player from the production database, with every match they
# played and every deletion of those matches. This is an owner tool for
# cleaning up test data; it is deliberately not a site feature, because the
# public log is append-only. Exact, case-insensitive name match.
#   scripts/delete-player.sh "Anders Bekkevard"
set -euo pipefail
name=${1:?usage: scripts/delete-player.sh "Player Name"}
cd "$(dirname "$0")/.."
scripts/db.sh -v ON_ERROR_STOP=1 -v name="$name" <<'SQL'
begin;
select id, name from players where lower(name) = lower(:'name') \gset
\if :{?id}
  delete from deletions where match_id in (
    select id from matches where :id in (a1, a2, b1, b2));
  delete from matches where :id in (a1, a2, b1, b2);
  delete from players where id = :id;
  \echo deleted player :name (id :id) with their matches
\else
  \echo no player named :name
\endif
commit;
SQL
