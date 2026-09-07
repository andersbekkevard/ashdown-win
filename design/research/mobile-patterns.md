# Mobile patterns worth copying

Research for the next design pass on ashdown.win. Every app below was examined
from its current App Store screenshots (fetched September 2026) or from
first-party design documentation. Every image URL was verified to return HTTP
200 before it was written down.

The site has three screens that matter: the leaderboard, the record-match flow,
and the player page. The question for each app is only ever "what does it do
that one of those three should steal".

---

## 1. Rating and ladder apps people already know

**Lichess** (iOS/Android). The home screen opens with a horizontally scrolling
row of rating chips — Blitz 1219, Rapid 1432, Correspondence 1831 — each with a
small green or red delta arrow next to the number. The rating is the first
thing on screen, before any content. Five-item bottom tab bar. Relevant to the
player page header and to the idea that a number with a delta beside it is the
whole identity of a player.

**Chess.com** (iOS/Android). Two things. The Friends screen renders a pending
game as two avatars stacked vertically with a `VS` badge between them — this is
the canonical two-party layout and it reads instantly on a phone. The Stats
screen puts a large area chart of rating over time under a row of big-number
tiles, annotates exactly one point on the curve (1678), and shows the headline
rating as a floating card with `1689 Bullet ↑42`. Copy the annotation
restraint.

**Strava** (iOS/Android). The segment leaderboard is the closest existing thing
to our leaderboard: a chip row of scopes (All-Time, All-Time Men, All-Time
Women, This Year), a crowned hero block for the record holder, then a dense
ranked table with columns for rank, athlete, and time, medal glyphs on the top
three, and the viewer's own row pinned at the bottom edge. The bottom tab bar
puts Record in the centre position, visually heavier than its neighbours.

**Duolingo** (iOS/Android). Leagues are a fixed cohort of thirty with
promotion and relegation zones drawn as horizontal rules inside the list, so
rank has consequences without any extra screen. The end-of-week result screen
is a single illustration, one line of text ("You finished #1 and kept your
position in the Diamond League"), and a full-width button pinned to the bottom.
That is the shape of our post-match confirmation.

**Zwift** (iOS/Android/desktop). Live rider leaderboard overlaid on the ride.
Included for completeness; the density is wrong for us and nothing here should
be copied.

---

## 2. Fast two-party entry

**Venmo** (iOS/Android). The send screen is the reference implementation of
"pick a person, enter one value, commit". The chosen person sits at the top as
an avatar plus name, the amount is set in very large type, a one-line note
field sits under it, and two buttons — Request and Pay — sit side by side
directly above the keypad, at the bottom of the screen. The Split screen shows
the same idea for several people: avatar rows, one editable number each.

**Splitwise** (iOS). "Add an expense" opens with a recipient line reading
`With you and: [Gajah]`, where the name is a removable token chip. Adding
people is typing into that line. This is the fastest known way to gather two to
four names on a phone, and it degrades gracefully from one to many, which is
exactly our singles-to-doubles problem.

**Cash App** (iOS/Android). Amount entry with a custom keypad, secondary
actions (Pool, Request) in a row, and the single primary action as a
full-width, full-contrast black button underneath them at the very bottom. The
Bitcoin screen shows the range selector we want on the player page: a pill row
of `1D 1W 1M 1Y ALL` immediately below the chart.

**Zelle** has no standalone consumer app worth citing; its flow lives inside
bank apps and its patterns are a subset of Venmo's.

---

## 3. Racket, table and club-ladder apps

**Pongly — Table Tennis ELO** (iOS). The nearest thing to a direct competitor,
and it gets two screens right. "Enter Match Result" stacks the two players as
rows, each with a stepper and a score, adds a Walkover/Forfeit switch, and puts
a single full-width orange Confirm Result button at the bottom. The player page
leads with a large current-rating card (975), then Rating History with a
segmented `Last 10 / Last 30 / All time` control, then a line chart whose
points are coloured by win, loss, or walkover, then a two-by-two grid of stat
tiles.

**Tennis Ladders** (iOS). A club ladder with no accounts, structurally very
close to ours. The ladder list rows carry avatar, name and total points; the
"Report a Match" action is a persistent row pinned at the bottom of the list
rather than a top-bar button. The player page pins a single "Challenge" action
to the bottom. The report-match sheet shows the two players as faces side by
side with names underneath. Its weaknesses are instructive too: three columns
of points (Earned / Borrowed / Total) on every row is more arithmetic than
anyone wants, and Cancel/Submit in the top navigation bar is the thumb-hostile
choice we are trying to avoid.

**UTR Sports** (iOS/Android). The profile header is three rating chips with a
reliability percentage under each, then a horizontal tab strip
(Overview / Stats / Results / Events / Communities). The Stats screen pairs
wins and losses in green and red inside each tile. The reliability chip is a
good answer to "this player has only played twice".

**SquashLevels** (iOS). Rating history chart at the top of the profile, then
success-rate donuts and a stat grid. More interesting: a head-to-head screen
showing your level against your opponent's with the expected game score derived
from the gap. We already compute the expected score E, so this is nearly free.

**Playtomic** (iOS/Android). The match screen shows a row of four player seats,
each an avatar with a level badge under it, and the unfilled seat is a dashed
circle with a `+` labelled "Available". This is the best doubles pattern found
anywhere in this survey and section 2 of the synthesis is built on it.

**Let's Foos** (iOS, from the Kickertool family). Dark table-football app with
a bracket screen that stacks two player pairs with `VS` between them, and a
bottom bar whose centre item is a circular pink action button.

**Swish Sports** (iOS). Pick-up game organiser. Bottom tab bar of five with a
centre "Create Game" plus. Its event-creation form is a long scroll with Submit
in the top bar — a good example of the pattern we are rejecting.

---

## 4. Leaderboard and history presentation

**Apple Fitness** (iOS). Card-grid summary, four-item bottom tab bar, green
pill primary buttons. Cited as the platform baseline our users' muscle memory
is calibrated to.

**Nike Run Club** (iOS/Android). The Activity screen is a clean template for
the player page: a `W / M / Y / All` segmented control under the title, one
very large number, a three-stat row under it, a bar chart, then "Recent
Activity" as a list. Also the large circular START button as the bottom-centre
primary.

**Garmin Connect** (iOS/Android). Every metric screen carries the same
`1d / 7d / 4w / 1y` segmented strip directly under the header, plus a nested
Overview / Stats / Laps / Charts tab strip on a detail page. Consistency of the
range control across screens is the lesson.

**Untappd** (iOS/Android). A circular floating action button sits above a
five-item bottom tab bar on the feed. Useful as a counter-example: the FAB is
an unlabelled `+`, and our primary action needs its words.

---

## 5. Bottom navigation, sheets and buttons

**Material 3** documents the navigation bar with an active-item pill
indicator, the bottom sheet with a drag handle at the top edge, and the FAB.
**Apple's Human Interface Guidelines** cover tab bars and sheets with the same
conclusions: persistent bottom navigation for peer destinations, sheets for
self-contained tasks. Both are cited below as normative sources rather than
inspiration.

---

## Synthesis

### (1) Home and leaderboard

Make the leaderboard the home page. There is no separate home screen to
design; a landing page whose job is to link to the leaderboard is a wasted tap.

Take the row anatomy from Strava's segment leaderboard, not from Tennis
Ladders: rank number, name, rating, and one delta column showing the change
over the last seven days in green or red. Four fields. Tennis Ladders' three
points columns are the failure mode to avoid. Give the top three the medal
treatment Strava uses, and draw a hairline rule after rank 10 the way Duolingo
draws its promotion zone, so position acquires meaning without any new feature.

Players with no matches yet must appear (the architecture doc requires it).
Give them a muted "new" chip in place of the delta, borrowing UTR's reliability
badge idea: the rating is shown, but marked as not yet earned.

Pin a search field under the header, Untappd-style, filtering rows as you type.
In a house of a few hundred people this is faster than scrolling and it
rehearses the same substring search used when recording a match.

At the bottom, a persistent action bar: a full-width primary "Record match" and
a smaller secondary "Add player" beneath or beside it. Cash App's stacking of
one loud primary under a quieter secondary row is the exact arrangement.

### (2) The record-match flow

Open it as a full-height sheet with a drag handle (Material 3), routed at a
real URL so the browser back button dismisses it.

Lay out two side cards stacked vertically with a `VS` between them, exactly as
Chess.com renders a pending game and Tennis Ladders renders a match report.
Vertical, not horizontal: phones are tall, and two stacked cards give each side
room for two names.

**Delete the doubles toggle.** Copy Playtomic instead: every side shows two
seats, the first solid, the second a dashed `+ add partner` placeholder. Filling
the second seat on either side makes it a doubles match and mirrors a second
placeholder onto the other side. One tap, no mode switch, no re-layout of a
form the user has already started filling. If a toggle survives for
discoverability, make it a segmented Singles/Doubles control in the sheet
header (Nike Run Club's `W M Y All` treatment), but the seats should still be
the real interaction.

Tapping a seat opens a search sheet with the input at the top and results
below, so the list is never hidden by the keyboard. Before any typing, show
recent opponents — most matches at one table are between the same two dozen
people, and this makes the common case zero-typing. Substring matching, and a
"Create <typed name>" row at the bottom of an empty result set, per the
architecture doc. A filled seat renders as a Splitwise-style token chip with an
`×`.

Picking the winner is a tap on the winning side card, which highlights. Then
one full-width primary button at the bottom, the Cash App and Pongly
arrangement: `Record match`. Never put Submit in the top bar.

On success, replace the sheet contents with a result state in the shape of
Duolingo's league result: one line ("Anders beat Kavya"), the two rating
deltas rendered large (`1042 → 1058, +16` and `1120 → 1104, −16`), and a
full-width Done. Follow it with an undo affordance for ten seconds. An undo
snackbar is a better first-line correction than routing people to a delete
flow.

### (3) The player page and rating graph

Copy Pongly's page order almost literally, because it is already tuned for this
exact sport: large current-rating card at the top with the recent delta beside
it (Lichess renders the same chip), then the chart, then stat tiles, then match
history.

Put a segmented range control directly under the chart title —
`Last 10 / Last 30 / All` from Pongly, or Cash App's `1W 1M 1Y ALL`. Garmin's
lesson is that this control must look identical everywhere it appears.

Draw the rating as a step line rather than a smooth spline. Elo moves in
discrete jumps at discrete matches, and a smoothed curve tells a lie about the
data. Colour each vertex by win or loss the way Pongly does. Label only the
first value, the last value, and the peak; Chess.com annotates exactly one
point on its rating chart and it is more readable than any densely labelled
axis. Skip the y-axis gridlines entirely on a phone.

Match history rows: opponent name, a W or L pill, the signed delta, and a
relative date. Colour the delta, not the whole row. Add UTR's paired
green/red win-loss tiles above the list.

Two additions worth the effort. First, a head-to-head strip in the style of
SquashLevels: this player's rating against yours with the expected score from
the Elo formula, which costs nothing because E is already computed. Second, pin
a single bottom action to the player page — `Record a match with <name>` —
which opens the record sheet with one seat pre-filled. Tennis Ladders pins
"Challenge" in the same slot and it is the highest-value button on that screen.

### (4) Navigation structure

Do not build a bottom tab bar. With two destinations it would be a costume, and
the cost of a permanent tab bar on a short page is real. Use a persistent
bottom **action** bar instead, holding the primary "Record match" button, which
is where the nine mockups already pointed. Lichess, Apple Fitness, Strava and
UTR all run four or five tabs; below three, the pattern stops paying for
itself.

Reject the floating action button (Untappd, Let's Foos). A circular `+` cannot
say "record match", and this site has exactly one verb worth naming.

Everything else is a link: the player page is a push navigation from a
leaderboard row with a back chevron, and the algorithm page is a small link in
the footer. Three levels total, no nesting.

Three web-specific notes, since none of the surveyed apps have to solve them.
Size the layout with `100dvh` so the collapsing Safari URL bar does not clip the
action bar. Pad the action bar with `env(safe-area-inset-bottom)` so it clears
the home indicator. And make the record sheet a real route rather than local
state, so the system back gesture dismisses it — that single detail is most of
what makes a web app feel native.

---

## Image URLs

All verified HTTP 200 on 2026-09-07.

**Lichess** — https://apps.apple.com/us/app/lichess/id1662361230
- Home, rating chips with deltas, bottom tab bar: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/9a/2f/1e/9a2f1ecc-69b5-e558-edb8-d3a2b6d561fc/Simulator_Screenshot_-_iPhone_16_Plus_-_2025-06-23_at_12.26.28.png/626x0w.png
- Puzzles list, bottom tabs: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/b6/2f/ac/b62facd8-bce9-c850-2187-36da0d57afa5/Simulator_Screenshot_-_iPhone_16_Plus_-_2025-06-23_at_12.18.21.png/626x0w.png

**Chess.com** — https://apps.apple.com/us/app/chess-com-play-and-learn/id329218549
- Friends screen, two players with VS badge: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/3d/bc/9c/3dbc9c84-2340-f4ae-3502-50709d4d728c/app_screenshot_1320x2868_6_EN.png/626x0w.png
- Stats screen, rating chart with single annotated point: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/90/19/e2/9019e266-5ed4-31b2-ae0d-408308ad857a/app_screenshot_1320x2868_7_EN.png/626x0w.png

**Strava** — https://apps.apple.com/us/app/strava-run-bike-walk/id426826309
- Segment leaderboard, chips, hero, ranked table, pinned own row: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/85/a6/ea/85a6eafe-0140-7415-d322-1291e1c625f2/07ASO-5.5-Leaderboards-en-US.jpg/392x696bb.jpg
- Progress screen with filter chips and comparison chart: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/33/f2/f4/33f2f44f-ad26-898c-884e-749588d44d2a/16ASO-5.5-ProgressComparison-en-US.jpg/392x696bb.jpg
- Bottom tab bar with weighted centre Record item: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/0c/2f/79/0c2f7976-ae13-a7eb-0473-46f4f6cf36ad/01ASO-5.5-Track_Workouts-en-US.jpg/392x696bb.jpg

**Duolingo** — https://apps.apple.com/us/app/duolingo-language-lessons/id570060128
- League result screen, one line plus full-width bottom button: https://duoplanet.com/wp-content/uploads/2021/05/IMG_0826-edited-1.png
- Streak screen: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/37/b0/99/37b099cd-086d-b920-2ed3-0be6507353c4/V2_iOS6.5_06.jpg/626x0w.png
- Exercise screen: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/cb/ee/31/cbee31c9-a814-b59b-db16-3136ce60d20d/V2_iOS6.5_02.jpg/626x0w.png

**Zwift** — https://apps.apple.com/us/app/zwift-indoor-cycling-fitness/id1134655040

**Venmo** — https://apps.apple.com/us/app/venmo/id351727428
- Send screen: recipient chip, large amount, Request/Pay above the keypad: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/41/0f/9a/410f9acf-49fe-64ea-4824-d63f01322071/1_Send-money.png/626x0w.png
- Split screen, avatar rows with one number each: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/50/bf/7a/50bf7a3f-40c2-452e-c19f-b5c2f1f12d29/6_Split-bill.png/626x0w.png

**Splitwise** — https://apps.apple.com/us/app/splitwise/id458023433
- Add an expense, "With you and: [token]" recipient line: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource116/v4/56/92/a3/5692a320-62fb-8953-f5f0-7b7bcc071e32/6945cdb7-146a-46b2-b614-b102d27c8399_iPhone_SE_03.png/392x696bb.png
- Record a payment, two avatars with a directional arrow: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource126/v4/58/cb/42/58cb4214-58ac-f8b5-e1c2-a85d7bb0b1e0/d810cd6c-f770-4392-9b9d-b02aa9f914e8_iPhone_SE_04.png/392x696bb.png

**Cash App** — https://apps.apple.com/us/app/cash-app/id711923939
- Amount keypad with full-width bottom Pay under a secondary row: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/5e/14/30/5e1430d6-4446-2347-6422-57f15f86f9b3/US_P2P_iPhone6.5__03.png/626x0w.png
- Chart with 1D/1W/1M/1Y/ALL range pills: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/39/a7/7a/39a77a96-a158-e3b6-d710-478048265d61/US_BTC_iPhone6.5__05.png/626x0w.png

**Pongly — Table Tennis ELO** — https://apps.apple.com/us/app/pongly-table-tennis-elo/id6772204000
- Enter Match Result, two player rows and one bottom Confirm button: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/0b/63/99/0b6399ab-65f6-1791-cc4c-a185610da0a2/4_match.png/626x0w.png
- Player page: rating card, Last 10 / Last 30 / All time, win-loss coloured chart, stat tiles: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/f4/9d/49/f49d49aa-23b5-2ba7-c8ce-df3301c4dd66/5_rating.png/626x0w.png

**Tennis Ladders** — https://apps.apple.com/us/app/tennis-ladders/id1449278968
- Ladder list with bottom-pinned "Report a Match": https://is1-ssl.mzstatic.com/image/thumb/Purple124/v4/f8/6d/0c/f86d0cba-b91c-45d9-78ae-fd29b965d017/pr_source.png/392x696bb.png
- Player page with bottom-pinned "Challenge": https://is1-ssl.mzstatic.com/image/thumb/Purple124/v4/60/82/a1/6082a1d0-887c-ca55-25ef-8ec324128120/pr_source.png/392x696bb.png
- Report a Match, two players side by side: https://is1-ssl.mzstatic.com/image/thumb/Purple114/v4/9e/b4/6a/9eb46a15-946f-95d7-6c07-06c889d09cd5/pr_source.png/392x696bb.png

**UTR Sports** — https://apps.apple.com/us/app/utr-sports/id1519232627
- Profile header: rating chips with reliability, tab strip, bottom tabs: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/07/c6/f3/07c6f396-c832-38d3-c658-c780b9ace815/AppStore_1290x2796_Slide2.jpg/626x0w.png
- Stats with paired green/red win-loss tiles: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/ac/27/38/ac2738bf-e665-878b-5064-b62df50c3611/AppStore_1290x2796_Slide3.jpg/626x0w.png

**SquashLevels** — https://apps.apple.com/us/app/squashlevels/id6743806671
- Rating history chart and stat grid: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/2b/31/2f/2b312f6e-a435-6481-4c15-a2daf6f81a6b/iPhone_6.9_1.png/626x0w.png
- Head-to-head: your level vs opponent with expected score: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/f7/f2/94/f7f294df-a5db-b5f4-5fae-49be3c0fba1a/iPhone_6.9_4.png/626x0w.png

**Playtomic** — https://apps.apple.com/us/app/playtomic-padel-pickleball/id1242321076
- Match screen with four player seats and a `+ Available` empty seat: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/15/33/85/15338587-3176-348c-9d0a-0dfa21e761ce/Screen4.png/392x696bb.png
- Progress card with level chart: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/95/72/54/957254af-ab18-70d3-9cbf-8055bbe1e958/Screen7.png/392x696bb.png

**Let's Foos** — https://apps.apple.com/us/app/lets-foos/id1483083379
- Bracket with stacked player pairs and VS: https://is1-ssl.mzstatic.com/image/thumb/Purple115/v4/e8/d7/99/e8d7998e-80b4-fac1-4f99-a6d735391d3b/6e034968-35a3-4f4b-99b2-16187a9bd032_kki-app-store-en-5.5inch-image2.png/392x696bb.png
- Player stats with bottom bar and circular centre action: https://is1-ssl.mzstatic.com/image/thumb/Purple125/v4/8c/8c/b3/8c8cb3c1-c4a9-3523-5779-85fc7713406e/6df37839-689d-41da-9000-6a9a0edb6ba0_kki-app-store-en-5.5inch-image3.png/392x696bb.png

**Swish Sports** — https://apps.apple.com/us/app/swish-sports/id1551295361
- Game detail with player list tabs, bottom tabs with centre Create: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource126/v4/66/15/6c/66156c4c-4c6e-f27c-f8e0-68e0bd0283c7/43f93c12-7471-4064-a937-310c38af9df5_Simulator_Screenshot_-_iPhone_8_Plus_-_2023-08-08_at_08.44.58.png/392x696bb.png
- Create an Event, icon-tile picker grid: https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/7c/16/07/7c16078e-2257-6c3f-85c2-484acfc0bceb/cc48b2f7-0fa4-4075-8bec-f330bf0181a8_Simulator_Screen_Shot_-_iPhone_8_Plus_-_2023-04-02_at_11.18.04.png/392x696bb.png

**Nike Run Club** — https://apps.apple.com/us/app/nike-run-club-running-coach/id387771637
- Activity: W/M/Y/All segmented control, big number, stat row, bar chart: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/87/6d/66/876d6689-41a7-d287-1e91-5111f2a336c0/97b95fd1-005f-4c9a-b8f9-bc1352ef194a_Nike_NikeRunClub_en-US_iOS_5.5_ScreenshotMockup_240820_02.png/392x696bb.png
- Large bottom-centre circular START: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/ee/a6/4c/eea64c55-f5d4-804f-3d93-6a9ffdd48b1c/d6da238e-d1e7-45cd-8da6-d67602d2abce_Nike_NikeRunClub_en-US_iOS_5.5_ScreenshotMockup_240820_03.png/392x696bb.png

**Garmin Connect** — https://apps.apple.com/us/app/garmin-connect/id583446403
- 1d/7d/4w/1y range strip under the header: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/2c/c8/ba/2cc8ba34-9574-2901-dba4-429c920881c8/bea409c6-0d83-435a-b71c-b031d2f6b930_5.5-Phone-EN-02.png/392x696bb.png
- Activity detail with Overview/Stats/Laps/Charts tab strip: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/4a/47/23/4a472350-b7ab-e4a0-ae43-683f0b6aba9a/149fe180-b514-4a45-9f96-bc8d57f81d23_5.5-Phone-EN-08.png/392x696bb.png

**Untappd** — https://apps.apple.com/us/app/untappd-find-drinks-you-love/id449141888
- Feed with FAB above a five-item bottom tab bar: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/bc/05/06/bc0506ba-28b0-f0ac-1d16-89e506554a6d/Slide_2.jpeg/626x0w.png
- Check-in detail, an event rendered as a record: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/4f/dd/fc/4fddfc4f-40bd-041a-a554-11d7eaf4d3ef/Slide_5.jpeg/626x0w.png

**Apple Fitness** — https://apps.apple.com/us/app/apple-fitness/id1208224953
- Summary card grid with four-item bottom tab bar: https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/a9/3e/5d/a93e5d33-7931-3d88-f22a-96d5081560e8/Fitness-iPhone6p9-LuckC-USEN-Wrapper1.png/626x0w.png

**Material 3**
- Navigation bar with active pill indicator: https://lh3.googleusercontent.com/n4J4Jub0Z8mMwpNmj68TF-0f6P8_KfxJPC_mVwKxeTLPAyCRKcovkuDTDSzgixYrZA04rWDtKb4iUYlvQXhyS1niYwNnPa9Cr-zzyLsOWzU1eSCpIA (https://m3.material.io/components/navigation-bar/guidelines)
- Bottom sheet with drag handle: https://lh3.googleusercontent.com/anRizsTTKb3ZFDxvaOQnGhnaepLiJtk__kY2eOG1-X9tBEOZ_Efjd8vHU14mujMBUuRZXdKZjW6kZp32adjusmMOSOrgzXKXqvJHUUkEDF9C-tteNDyQ (https://m3.material.io/components/bottom-sheets/guidelines)
- Floating action button: https://lh3.googleusercontent.com/Hw0sslK5sGrGpnxb9hsvdsGJ0mIEzpIwbx1SyM7s-XAiu136AGItSHA5FbtiqtlsNrhCa7rgqSykcayLLh0rfhlA3Nk9un0yaTNtl9VyjthYXJywXm2H (https://m3.material.io/components/floating-action-button/guidelines)

**Apple Human Interface Guidelines**
- Tab bars: https://developer.apple.com/design/human-interface-guidelines/tab-bars
- Sheets: https://developer.apple.com/design/human-interface-guidelines/sheets

**Design galleries** (page references; images are behind an account)
- Strava Android leaderboard: https://mobbin.com/explore/screens/b8a5f43f-579a-4b4e-a314-28da2bcd2bf0
- Mobbin leaderboard collection: https://mobbin.com/explore/mobile/screens/leaderboard
