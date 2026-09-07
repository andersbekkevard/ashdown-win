# One enormous word

## Style language

White paper, black ink, one grotesk. The page says one thing at a size that
cannot be ignored and then says everything else quietly. On the poster the
enormous word is the URL itself, set flush left across two lines so the domain
is the headline, the logo, and the call to action at once. On the site the
enormous thing is the rating number: the leader's rating on the home page and
the player's own rating on their page, each set at roughly a third of the
viewport width.

Hierarchy comes from size and weight only. There is one text colour and one
grey for metadata. Rules are 1px black hairlines; they separate rows and
sections and replace every box, card, and shadow. Type is flush left, ragged
right, tracked tight at display sizes and normal at text sizes. Numerals are
tabular so columns of ratings align without a table. Nothing is centred except
the sheet on the screen.

Motion appears only where a rating changes: a number rolls from its old value
to its new one after a match is recorded or when a player page opens. Nothing
else moves.

## References

- Massimo Vignelli, the Vignelli Canon and the NYC subway signage
  (https://en.wikipedia.org/wiki/Massimo_Vignelli). Taken: a few typefaces are
  enough, black Helvetica on white is a complete system, and information must
  be "semantically correct, syntactically consistent, pragmatically
  understandable". The leaderboard is signage.
- Experimental Jetset, Stedelijk Museum identity, 2012
  (https://fontsinuse.com/uses/12058/stedelijk-museum-identity-2012). Taken: a
  single neutral grotesk (Union) at extreme scale, all the identity carried by
  the word itself, no image needed.
- Wim Crouwel, Stedelijk posters 1964–85
  (https://eyemagazine.com/blog/post/crouwels-institutional-intuition,
  https://en.wikipedia.org/wiki/Wim_Crouwel). Taken: the grid as the only
  ornament, and that a system's pieces must each work alone on a wall.
- Josef Müller-Brockmann, Musica Viva posters
  (https://socks-studio.com/2016/11/30/joseph-muller-brockmann-musica-viva-posters-for-the-zurich-tonhalle/).
  Taken: Akzidenz-Grotesk on a strict column grid, "complete freedom within
  the rigid system", and the small-text block sitting under a large form.

## Palette

- Paper: #FFFFFF
- Ink: #000000
- Metadata grey: #8A8A8A
- Placeholder grey: #BBBBBB
- Rules: 1px #000000

## Typefaces

Inter Tight (Google Fonts), 400 for text, 500 for names and actions, 800 for
the enormous word and giant numbers. Fallback stack: Helvetica Neue, Helvetica,
Arial, sans-serif. Tabular numerals via `font-variant-numeric: tabular-nums`.
No second typeface.

## Why it suits a dorm ladder

A ladder is a list of names and numbers, and this style refuses to pretend it
is anything else. Residents pass the poster on the way to the table; a wall
with one huge word on it is read in the time it takes to walk past, and the
domain is short enough to remember without the QR code. On a phone at the
table, a black number on a white screen is legible from across the room, and
the absence of decoration means the three-tap journey has nothing to compete
with. The style also fits the trust model: the site withholds everything but
the record, which is exactly what makes the record believable.
