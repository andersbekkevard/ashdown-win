---
type: adr
adr: 0002
status: Accepted
date: 2026-09-07
---
# 0002 — A player is a name and nothing else

## Status

Accepted.

## Context

With no accounts, a player needs one stable identity in the log so that a
track record means something. The identity must be found by other people
when they record a match against that player. Some residents will not want
their full name on a public site.

A social layer, such as contact details for arranging matches, was discussed
and is attractive, but costs sign-up friction before the ladder has proven
itself.

## Options considered

### Option 1: Full name required
- Pros: unambiguous, human-readable.
- Cons: excludes people who do not want their name public.

### Option 2: Any free name, no guidance
- Pros: maximal freedom.
- Cons: duplicates and unfindable names.

### Option 3: Full name by default, with a guided fallback (selected)
- Pros: most people use a name others recognise; the fallback is unique by
  construction; the last resort is explicit about the cost.
- Cons: two extra sentences on the create screen.

### Option 4: Optional contact field from day one
- Pros: enables match-finding.
- Cons: raises the question "why do they want this" at the wrong moment.

## Decision

A player is a name. Creation asks for a full name by default. A link worded
like "I'd rather not use my full name" reveals two alternatives: the MIT
username, which is unique by construction, or any name the person knows to
be unique, with the warning that others must be able to find it.

No contact details, email, phone, or login are collected in version one.
The table is the meeting place.

Match recording searches any substring of a name, case-insensitively, and
offers "did you mean" before allowing a new player to be created. A
non-matching name never creates a player silently.

## Consequences

- The data model has one field of personal data: the chosen name.
- The repository can be public with no privacy review.
- Messaging and match-finding are deferred, not rejected.

## Reversal triggers

- Around thirty active players, if people ask for a way to reach each other.
- Duplicate players keep appearing despite the nudge.

## Related

- [0001 — No accounts](0001-no-accounts-social-pressure.md)
