# Architecture

## Purpose

ashdown.win exists to get more people playing at the one table tennis table in
Ashdown House. The rating is the excuse; the social effect is the goal. Every
design choice below is judged by one question: does it lower the friction of
recording a match, or raise the pull of looking at the board?

## The product in one screen

The home page has three things: a **Create player** action, a **Record match**
action, and the **leaderboard**. Nothing else is needed to use the site.

- **Create player** asks for a full name by default. A secondary link, worded
  like "I'd rather not use my full name", offers the MIT username (the part
  before the @) as a unique alternative, and below that, any name the person
  knows to be unique, with a reminder that others must be able to find it when
  recording a match.
- **Record match** has one search box per side, a doubles toggle that adds a
  second box per side, and one tap on the winning side. Search matches on any
  substring, case-insensitively. A name that matches nobody offers a "create
  this player" option rather than creating silently.
- The **leaderboard** lists every player from the moment they are created,
  including those with no matches yet, so a new player sees exactly where the
  first match will send them.

Each player has a public page: current rating, a graph of rating over time,
and the full list of matches with opponents and outcomes.

A separate **algorithm** page, reachable from a small link, presents the
rating maths as a short paper. Its source is [algorithm.md](algorithm.md).

## Data model

Two kinds of thing exist.

- A **player** is a name and a creation time.
- A **match** is a creation time, one or two player names per side, and which
  side won. A **deletion** is a later entry that points at a match and marks it
  void.

That is the whole schema. There are no stored ratings.

## Ratings are derived, never stored

Every rating shown anywhere is computed by replaying the match log from the
start with the current constants. This makes three things free that are
otherwise painful:

- Changing K, the starting rating, or the doubles rule applies to all of
  history at once. The constants live in one config file,
  `src/lib/config.ts`.
- Deleting a match is just an entry in the log. Nothing has to be unwound.
- The log is the audit trail. Any rating can be reproduced by hand from
  public data, which is what makes an open ladder trustworthy.

At the scale of a residence this replay costs nothing for years. If it ever
does, a cached snapshot keyed on the log's length is the obvious fix.

## Trust model

There is no login. Anyone can create players, record matches, and delete
matches. The only guard is that everything is visible: the log shows who was
filed against whom and when, and a deletion is as public as the match it
voids. The house is small enough that social pressure does the rest, and a
cheater who cares enough to game a dorm ladder has already proven the ladder
matters. See ADR 0001.

## Identity

A player is a name. Nothing else is collected. Contact information, "find me a
match" features, and any login are deliberately out of scope for the first
version. The table itself is the meeting place. See ADR 0002.

## Hosting

Vercel serves the site and Neon provides Postgres. Both are on free tiers and
the site is designed to stay within them indefinitely, so a future resident
can inherit it without a bill. See ADR 0004.

Deploys happen on every push to `main`. The build runs `scripts/migrate.mjs`
first, which applies pending Drizzle migrations against `DATABASE_URL` when
one is set, so a schema change ships with the code that needs it. The Neon
integration in the Vercel project sets `DATABASE_URL` for production and
preview. Since 2026-09-07 the production site is https://ashdown.win.

## Name

The domain is ashdown.win and the repository is ashdown-win. The name belongs
to the house, not the sport, so a pool ladder or anything else can join later
without a rename. See ADR 0005.

## Out of scope, for now

- Accounts, verification, or match confirmation by the loser.
- Contact details or messaging.
- Score lines. A match is a winner and a loser only.
- A "who is at the table now" indicator.
- Rating decay, provisional periods, or a variable K.

Each of these has a note in the [decision ledger](decision-ledger.md) with
the condition under which it would be revisited.
