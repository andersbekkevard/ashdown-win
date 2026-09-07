# Lichess adaptation

## Research

- https://lichess.org/ — dark by default, thin header with a light wordmark, flat rounded boxes on a darker page. Took: two-tone background, the box idiom, zebra rows as the only decoration.
- https://lichess.org/@/DrNykterstein — rating rows reading `Bullet 3243 ↗14 9,583 games`, then a rating-history line chart with uppercase range buttons. Took: that row grammar, the chart, progress over the last 12 games.
- https://lichess.org/player — top-10 lists under a gold header; `?` after provisional ratings. Took both.
- https://github.com/lichess-org/lila/tree/master/ui/lib/css/theme — `_theme.default.scss`, `_theme.light.scss`: palette derived from `---site-hue: 37deg`. Also `component/_button.scss`, `component/_slist.scss`, `base/_util.scss` (`good.rp`/`bad.rp` arrows), `abstract/_extends.scss` (fonts).
- https://www.chess.com/leaderboard for contrast — avatars, diamonds, flags. Lichess shows none; the number is the identity.

## Language

Two-tone dark surfaces, blue for links and primary actions, green for win, red for loss, gold only on the leaderboard header. Deltas always carry an arrow and a colour. The rating is the loudest number on every screen. The only drawn mark is a paddle where Lichess has its knight.

## Palette

| Token | Dark | Light |
|---|---|---|
| bg-page | hsl(37 10% 8%) | hsl(37 10% 92%) |
| bg (box) | hsl(37 7% 14%) | hsl(0 0% 100%) |
| bg-zebra | hsl(37 5% 19%) | hsl(37 12% 96.5%) |
| font | hsl(0 0% 73%) | hsl(0 0% 30%) |
| font-dim | hsl(0 0% 58%) | hsl(0 0% 47%) |
| border | hsl(0 0% 25%) | hsl(0 0% 85%) |
| primary | hsl(209 79% 56%) | hsl(209 77% 46%) |
| good | hsl(88 62% 37%) | same |
| bad | hsl(0 60% 50%) | same |
| brag | hsl(37 74% 43%) | hsl(37 74% 48%) |

## Type and spacing

Noto Sans 400/600 for body and numbers; Roboto 300 for headings and wordmark, Roboto 500 uppercase for buttons. Base 14px, radius 7px, box padding 1.2rem, rows 0.7rem.

## Why it suits a dorm ladder

The people at the table already read chess ratings on their phones. A board that looks like the one they trust needs no explanation: a four-digit number, a green or red arrow, a line that goes up. The style is honest about what the site is, a public log with derived numbers, and its dark default reads well on a phone held over a table.

## Refinement 2026-09-07

- Primary actions moved to a fixed bottom bar on mobile (Create player metal, Record match green), following the lichess-mobile bottom-bar idiom: surface-coloured, top hairline, safe-area padded. On the record screen the bar becomes the submit row (Cancel + Record match) so the confirming tap is in the same place. Desktop keeps the side column.
- Home is now the two actions and the leaderboard; the "How the rating moves" side box is gone (the Algorithm link in the footer covers it).
- Doubles is a macOS-style pill switch (51×31, round white knob with drop shadow, green track when on); the whole row is the tap target and sits above the name boxes so the form grows below it.
- Chart tooltip shows date, singles/doubles, opponent, new rating and delta; it follows the nearest point and works with touch (pointer events). X axis now shows dates. History rows carry a coloured left edge, a W/L badge, and a one-figure/two-figure icon for singles/doubles, so result and kind read without text. The full 14-match log is inlined because `data.json`'s six `recent` deltas do not reconcile with `history`; the mockup's list deltas equal the history differences.
- Contrast: text tokens pass 4.5:1 on box and zebra in both themes (dark: dim grey 58→64%, red 50→69% lightness, green 37→41%, gold 43→47%, blue 56→61%; light: dim grey 47→39%, blue 46→41%, green 37→30%, gold 48→34%). Filled surfaces got separate `*-bg` tokens (green button, blue button, gold bar) darkened so white text passes; `.shy` opacity raised .65→.85. Hues and saturations are unchanged. Theme toggle untouched.
- Poster: real QR for https://ashdown.win from an inline encoder written for this file (version 1, level M, alphanumeric mode, upper-case URL so it fits 21 modules; verified against a reference encoder and decoded with OpenCV). 72 mm white box, 2.5 mm modules, the largest that fits the A4 layout; comfortable at about 1.5 m, marginal at 2 m.
- Not visually verified in headless Chrome: the run was cut short before the screenshot pass, so a review of the render at 390 px and 1200 px is still owed.
