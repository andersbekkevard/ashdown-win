---
type: adr
adr: 0004
status: Accepted
date: 2026-09-07
---
# 0004 — Vercel hosting with Neon Postgres

## Status

Accepted.

## Context

The site is a few pages and one append-only table. It must cost nothing to
keep running, deploy from a git push, sit on a custom domain, and be
inheritable by a future resident without a server to administer.

## Options considered

### Option 1: Vercel plus Neon Postgres (selected)
- Pros: free tier covers the load indefinitely; Neon integrates directly with
  Vercel; custom domain is a two-minute step; smooth tooling.
- Cons: two providers instead of one; serverless functions have no local disk,
  hence the external database.

### Option 2: Cloudflare Pages plus D1
- Pros: one provider, free, SQLite built in.
- Cons: rougher developer tooling; nothing decisive over option 1.

### Option 3: A personal server
- Pros: full control.
- Cons: the ladder would depend on one resident's machine and attention.

## Decision

Vercel serves the application. Neon provides Postgres. The domain is
registered through Vercel so DNS needs no separate step. The site is designed
to stay within both free tiers.

## Consequences

- Deploys happen on push to the main branch.
- The database holds the players table and the match log only.
- Handover to a future resident is a transfer of one Vercel project and one
  Neon project.

## Reversal triggers

- Either free tier is withdrawn or the site outgrows it.

## Related

- [0005 — ashdown.win as house identity](0005-ashdown-win-house-identity.md)
