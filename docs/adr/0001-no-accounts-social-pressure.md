---
type: adr
adr: 0001
status: Accepted
date: 2026-09-07
---
# 0001 — No accounts; social pressure is the guard

## Status

Accepted.

## Context

The site's purpose is to get more people playing at one table. Every step
between "I just won" and "the board shows it" loses players. At the same time,
an open site where anyone can file any result invites fake wins.

Ashdown House holds a few hundred residents who see each other daily. The
match log is fully public.

## Options considered

### Option 1: Accounts with login
- Pros: each result has an author; cheating is attributable.
- Cons: sign-up friction at the exact moment the site is trying to win a new
  player; a login step every time a match is recorded; a password or OAuth
  surface to maintain.

### Option 2: Loser confirms before the rating moves
- Pros: no fake wins without collusion.
- Cons: a second person has to act, on their own phone, later. Unconfirmed
  matches pile up and the board goes stale.

### Option 3: No accounts, everything public (selected)
- Pros: zero friction; the log is the audit; deletions are as visible as
  matches.
- Cons: fake results are possible.

## Decision

No accounts. Anyone can create a player, record a match, or delete a match.
Every action is a public, timestamped log entry. Deletion appends; nothing is
ever mutated or hidden.

Cheating is accepted as a possible outcome. In a house this size it would be
noticed, and a ladder worth cheating on is a ladder that has succeeded.

## Consequences

- No sign-up flow, no session state, no password reset.
- The create-player screen is the only moment the site speaks to a person as
  themselves. Anything the site ever needs to ask must be asked there.
- Correction of mistakes is by deletion, by anyone, visibly.
- Any future identity feature is an addition, not a replacement, and must keep
  recording a match possible without logging in.

## Reversal triggers

- Fake results appear and social pressure does not correct them.
- A feature that needs presence or contact details is wanted, which needs some
  identity.

## Related

- [0002 — Name-only identity](0002-name-only-identity.md)
- [0003 — Single rating derived from the log](0003-single-rating-derived-from-log.md)
