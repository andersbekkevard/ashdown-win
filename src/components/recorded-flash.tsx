"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";

const COLOURS = ["#fb3aa3", "#00b5fe", "#ffd046", "#5eeac0", "#7c7be8", "#ffffff", "#c81c74"];
const N = 70;
/** Deterministic scatter so the render is pure; varied enough to look random. */
const jitter = (i: number, k: number) => ((i * 9301 + k * 49297 + 233) % 233280) / 233280;

/**
 * One-shot moment after recording: "Recorded!" flies up to the face with a
 * burst of confetti, then everything clears and the board is underneath.
 */
export function RecordedFlash() {
  const router = useRouter();
  const [gone, setGone] = useState(false);
  // Pieces carry inline custom properties; render them only after hydration
  // so the server HTML and the client tree never disagree.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    const t = setTimeout(() => {
      setGone(true);
      router.replace("/", { scroll: false });
    }, 1900);
    return () => clearTimeout(t);
  }, [router]);

  if (gone) return null;

  const pieces = Array.from({ length: N }, (_, i) => {
    const angle = jitter(i, 1) * Math.PI * 2;
    const speed = 160 + jitter(i, 2) * 260;
    return {
      dx: `${Math.round(Math.cos(angle) * speed)}px`,
      dy: `${Math.round(Math.sin(angle) * speed * 0.6 - 120)}px`,
      fall: `${Math.round(260 + jitter(i, 5) * 200)}px`,
      r: `${Math.round(jitter(i, 3) * 900 - 450)}deg`,
      delay: `${Math.round(jitter(i, 4) * 140)}ms`,
      colour: COLOURS[i % COLOURS.length],
      round: i % 3 === 0,
      w: 7 + Math.round(jitter(i, 6) * 8),
    };
  });

  return (
    <div className="flash" aria-live="polite" role="status">
      <div className="flash-confetti" aria-hidden="true">
        {mounted && pieces.map((p, i) => (
          <i
            key={i}
            className={p.round ? "round" : ""}
            style={
              {
                "--dx": p.dx,
                "--dy": p.dy,
                "--fall": p.fall,
                "--r": p.r,
                animationDelay: p.delay,
                background: p.colour,
                width: p.w,
                height: p.round ? p.w : Math.round(p.w * 0.55),
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <div className="shout flash-word">Recorded!</div>
    </div>
  );
}
