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
  -- Hand the numbers back: continue from the highest remaining id, or from 1
  -- when a table is empty, so the next real entry is not numbered after ghosts.
  select setval('players_id_seq', coalesce(max(id), 1), max(id) is not null) from players;
  select setval('matches_id_seq', coalesce(max(id), 1), max(id) is not null) from matches;
  select setval('deletions_id_seq', coalesce(max(id), 1), max(id) is not null) from deletions;
  select setval('restores_id_seq', coalesce(max(id), 1), max(id) is not null) from restores;
  \echo deleted player :name (id :id) with their matches; sequences resynced
\else
  \echo no player named :name
\endif
commit;
SQL
