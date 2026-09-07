---
type: adr
adr: 0003
status: Accepted
date: 2026-09-07
---
# 0003 — One rating per player, derived from the log

## Status

Accepted.

## Context

Players will play both singles and doubles at the same table. Doubles must
count, because the aim is to keep everyone who touches the table inside the
ladder. Chess-style Elo is designed for one-on-one play and has no native
doubles rule.

The constants will probably need tuning once real matches exist.

## Options considered

### Rating storage
- Store a current rating per player and update it on each match.
  Simple reads, but deletions and constant changes require manual unwinding.
- Recompute every rating from the log on demand (selected).
  Free deletions, free constant changes, full audit. Costs a replay that is
  trivial at residence scale.

### Doubles
- Ignore doubles. Loses players.
- Separate doubles rating. Splits attention across two boards.
- Team-average Elo into the single rating (selected). The standard amateur
  racket-ladder convention.
- TrueSkill or similar. Correct, heavy, unexplainable in one line.

### K factor
- Chess-style tiered K by experience. More accurate, harder to explain.
- Fixed K (selected), with the value in one config line.

## Decision

Each player has exactly one rating. It is computed by replaying every
non-deleted match in the log from a starting value with the current
constants. Nothing stores a rating.

Singles use standard Elo with K = 32. A doubles team plays as the average
of its two ratings; both partners receive the same update with K = 16.
Everyone starts at 1000. The full maths is in
[docs/algorithm.md](../algorithm.md).

## Consequences

- The match log is the only state. Backing up the log backs up everything.
- Changing a constant is a one-line edit and applies to all history.
- The algorithm page can state the whole rule in a few equations.
- Rating history per player is a by-product of the replay, so the player
  graph costs nothing extra.

## Reversal triggers

- Experienced players' ratings swing too much on single results. Introduce a
  lower K after N matches.
- Players ask for a separate doubles board.
- Replay latency becomes noticeable. Add a cached snapshot keyed on log length.

## Related

- [0001 — No accounts](0001-no-accounts-social-pressure.md)
