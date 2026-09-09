"use client";

import { useMemo } from "react";
import { Crown } from "./crown";
import type { Selected } from "./player-search";

const COLOURS = ["#fb3aa3", "#00b5fe", "#ffd046", "#5eeac0", "#7c7be8", "#ffffff"];

/** Deterministic scatter so the render is pure; varied enough to look random. */
const jitter = (i: number, k: number) => ((i * 9301 + k * 49297 + 233) % 233280) / 233280;

/** The moment after recording: a tilted banner, confetti, and the deltas. */
export function RecordedBanner({
  a,
  b,
  winner,
  deltaA,
  onBoard,
  onAgain,
}: {
  a: Selected[];
  b: Selected[];
  winner: "a" | "b";
  deltaA: number;
  onBoard: () => void;
  onAgain: () => void;
}) {
  const winners = winner === "a" ? a : b;
  const losers = winner === "a" ? b : a;
  const win = Math.abs(Math.round(deltaA));
  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => {
        const angle = (i / 36) * Math.PI * 2 + jitter(i, 1) * 0.4;
        const dist = 120 + jitter(i, 2) * 160;
        return {
          dx: `${Math.cos(angle) * dist}px`,
          dy: `${Math.sin(angle) * dist - 60}px`,
          r: `${Math.round(jitter(i, 3) * 720 - 360)}deg`,
          delay: `${Math.round(jitter(i, 4) * 120)}ms`,
          colour: COLOURS[i % COLOURS.length],
        };
      }),
    [],
  );

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Match recorded">
      <div className="banner pop-in">
        <div className="confetti" aria-hidden="true">
          {pieces.map((p, i) => (
            <i
              key={i}
              style={
                {
                  "--dx": p.dx,
                  "--dy": p.dy,
                  "--r": p.r,
                  animationDelay: p.delay,
                  background: p.colour,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
        <Crown className="banner-crown" />
        <div className="shout big">Recorded!</div>
        <div className="who">
          {winners.map((p) => p.name).join(" & ")} beat {losers.map((p) => p.name).join(" & ")}
        </div>
        <div className="deltas">
          {winners.map((p) => (
            <span key={p.id} className="pill up">
              +{win} {p.name.split(" ")[0]}
            </span>
          ))}
          {losers.map((p) => (
            <span key={p.id} className="pill down">
              −{win} {p.name.split(" ")[0]}
            </span>
          ))}
        </div>
        <div className="banner-buttons">
          <button type="button" className="btn ghost" onClick={onAgain}>
            Record another
          </button>
          <button type="button" className="btn" onClick={onBoard}>
            See the board
          </button>
        </div>
      </div>
    </div>
  );
}
