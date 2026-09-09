# Match and welcome motion

2026-09-09. Replaces the delayed, route-triggered Recorded flash. The selected
Fall Guys visual language remains the starting point; these timings are an
adaptation for this app, not measured timings from the game.

## References and interpretation

Fall Guys art lead Dan Hoang describes simple, humorous forms, flour-sack
motion studies, and tactile vinyl-toy references in his
[visual-development thread](https://threadreaderapp.com/thread/1296917830244405254.html).
The useful translation to typography is weight: a quick approach, a small
elastic overshoot, a readable settle, then movement toward the viewer as it
clears. The text remains level during its readable hold. No game assets or
character animation are copied.

[Raycast's Confetti announcement](https://www.raycast.com/changelog/windows/4)
establishes the standalone celebratory command as a useful product reference.
It does not publish a browser implementation or timing recipe; this app does
not claim to reproduce Raycast's physics.

Two existing open-source implementations were considered:

| Reference | Useful convention | Choice |
|---|---|---|
| [canvas-confetti](https://github.com/catdad/canvas-confetti), especially its [Realistic Look and side-cannon examples](https://www.kirilv.com/canvas-confetti/) | Mix particle velocities and spreads to avoid an even fan; use gravity, decay, tilt and wobble; keep the text area readable | Use the library directly on an owned canvas |
| [Discord confetti-cannon](https://github.com/discord/confetti-cannon) | A reusable canvas and configurable confetti pieces | Considered; unnecessary extra machinery for this one-shot effect |

## Implemented sequence

`CelebrationProvider` in the root layout owns the effect across navigation.
Forms start it on a valid submission, before awaiting their server action.
The overlay is a direct body child, outside scrolling cards and the inline
creation sheet. A full-viewport grid owns centering; nested elements own
scale and rotation. Welcome uses a distinct modifier class so it cannot
inherit the existing profile welcome card's margins or borders.

| Moment | Motion and meaning |
|---|---|
| Click | Recording… or Joining… appears immediately, approaching from 32% scale |
| First 440 ms | Slight overshoot, then settle at full size |
| Save confirmed | Recorded! in pink or Welcome! in lilac; a small expansion pulse and two confetti cannons |
| Next 1.44 seconds | Readable hold, with a slight forward drift; navigation proceeds underneath |
| Final 360 ms | Text expands toward the viewer and the entire overlay fades |
| At 1.8 seconds after confirmation | Remove overlay, canvas and timer |
| Failure | Cancel the effect and show the form error; retain entered values |

Confetti uses 168 pieces split across two origins and two velocity/spread
groups per origin. After iPhone review, particle dimensions were increased
to roughly three times the initial mobile size, with 50% more pieces, so
the burst reads as substantial paper confetti. Mobile scalar values are
2.4 and 1.8; desktop values are 2.8 and 2. Smaller mobile velocities keep
the burst on screen.
The canvas is loaded with the shared component, so no click-time import is
needed. Reduced motion keeps the message static and omits confetti. The
effect never captures pointer input. Only a confirmed write gets success
copy or confetti; transport failures advise checking the log/board because
the client may not know whether the server saved.

Standalone creation navigates to the profile; inline creation closes the
sheet and selects the new player while Welcome remains visible. The
profile's existing WhatsApp invitation remains. Picking an existing player
does not produce Welcome. There is no `?recorded` trigger, so back/reload
cannot replay a success animation.

## Replay and verification

In development, open `/dev/celebrations` for repeatable Recorded, Welcome,
slow-save and failed-save previews. This route writes no data and shows the not-found page in production.
The production response was checked for the absence of preview controls.

Browser checks against the local development database:

- With 900 ms additional action latency, Recording appeared at 15 ms;
  Recorded appeared at 1415 ms, before navigation at 1635 ms. The first
  visible frame remained centered to within 0.01 CSS px. These are local
  observations, not a production latency guarantee.
- Standalone creation showed Joining at 15 ms and Welcome at 328 ms,
  then reached the profile and cleared the overlay.
- Inline creation retained both selected players and stayed on the match
  form while Welcome was visible.
- A simulated thrown network error cleared the overlay, preserved both
  players, re-enabled submission, and displayed the error.
- Both labels fit 320, 390 and 768 CSS-pixel nested browser viewports at
  the confirmation peak, centered to within 0.01 px, and cleared afterwards.
- Reduced-motion behavior was checked by activating the app's real CSS
  media rules and simulating the matching media query in the browser;
  the message stayed static and the canvas was hidden and unpainted.

Screenshots were inspected at narrow width. Native iPhone/Safari behavior
has not been measured in this check.
