# Live indicator and WhatsApp entry

Design draft, 2026-09-09. Implemented as an uncommitted local change first so
it can be seen on a phone and undone.

## Live indicator

Where: the top bar, in the slot the Log chip occupied. It links to the log.

Shape: an ink pill the same height as the How chip. Left, an 8 px dot. Right,
a short time in Fredoka bold. The logo drops from 22 px to 19 px so the row
keeps real slack on a 375 px phone.

States, driven by the time of the latest recorded match:

| Since last match | Dot | Label |
|---|---|---|
| under 2 minutes | vermilion, blinking at 1 Hz | just now |
| under 10 minutes | vermilion, blinking at 1 Hz | 4m ago |
| under 24 hours | vermilion, steady | 2h ago |
| longer, or no matches | hollow ring | quiet |

The blink is a hard on-off, the camera recording cadence, not a fade. With
reduced motion the dot holds lit. The label is a time rather than a word
because a time is the higher signal: "4m ago" can only mean one thing.

Grammar borrowed from recording indicators: the REC dot on cameras and
Apple's recording status pill. Chosen from the round-three exploration in
`explorations/live-indicator/live3.html`, option 8, the "ago pill".

## WhatsApp entry

The top bar has no room left, so the group link goes where people already
look. A green row under the lead line on the home page: the WhatsApp glyph
and "Join the Ashdown ping-pong group", one tap to the invite link. The same
row appears on a player's own page right after they create themselves, under
a short "You're on the board" note, since that is the moment they have just
committed. The invite link is a constant in `src/lib/config.ts`.

## Not doing

No word like LIVE or REC as the label. No bare dot without a container. No
mint or gold. No tab bar.
