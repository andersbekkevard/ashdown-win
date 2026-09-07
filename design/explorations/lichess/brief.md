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
