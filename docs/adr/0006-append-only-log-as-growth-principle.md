---
type: adr
adr: 0006
status: Accepted
date: 2026-09-09
---
# 0006 — The append-only log is the growth principle

## Status

Accepted.

## Context

ADR 0003 made ratings a pure function of the match log. The site is now live,
and a list of possible features exists (roadmap.md): contacts, verification,
merges, a second game, seasons. Anders' two fears are losing the log to a bad
migration and disappointing users so they stop trusting the site.

## Options considered

### Option 1: Mutable rows, features edit state in place
- Pros: conventional; fewer rows.
- Cons: every feature risks rewriting history; undo needs its own design each
  time; a bad migration can destroy data that cannot be recomputed.

### Option 2: Append-only log, everything else derived (selected)
- Pros: undo is a new entry; every feature is additive; the log can be
  exported as plain JSON and replayed anywhere; a migration never touches
  existing rows.
- Cons: derived state is recomputed on read, which costs time at a scale this
  house will not reach; multi-step state (delete, restore, delete) needs a
  small rule.

## Decision

Rows in the log tables are inserted and never updated or deleted. Undo is a
restore entry. Identity changes, merges, contacts, games, seasons, and venues
are new tables or new entry kinds beside the log. Migrations only add tables
and nullable columns.

The log is protected three ways: an export before every migration, a daily
export to a private repository, and the provider's point-in-time restore.

## Consequences

- Deleting a match asks for confirmation but is never destructive; the
  restore entry makes a wrong tap harmless.
- The Vercel build does not migrate unless explicitly allowed, so a push
  cannot change the schema by accident.
- Hard deletion exists only as an owner script for test data.

## Reversal triggers

- Replay latency becomes noticeable. Add a cached snapshot keyed on the log's
  length; the log stays authoritative.

## Related

- [0001 — No accounts](0001-no-accounts-social-pressure.md)
- [0003 — Single rating derived from the log](0003-single-rating-derived-from-log.md)
