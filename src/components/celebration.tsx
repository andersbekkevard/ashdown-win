"use client";

import confetti from "canvas-confetti";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";

type Kind = "record" | "welcome";
type Moment = { id: number; kind: Kind; confirmed: boolean };
type Ticket = { confirm: () => void; cancel: () => void };
const CelebrationContext = createContext<((kind: Kind) => Ticket) | null>(null);

/** Lives above routes: the click starts motion and a confirmed save survives navigation. */
export function CelebrationProvider({ children }: { children: ReactNode }) {
  const [moment, setMoment] = useState<Moment | null>(null);
  const sequence = useRef(0);
  const clear = useCallback((id: number) => {
    setMoment((current) => current?.id === id ? null : current);
  }, []);
  const begin = useCallback((kind: Kind): Ticket => {
    const id = ++sequence.current;
    setMoment({ id, kind, confirmed: false });
    return {
      // A server action runs in a transition. Paint success now, independently
      // of the destination's data fetch or Suspense boundary.
      confirm: () => flushSync(() => setMoment((current) =>
        current?.id === id ? { ...current, confirmed: true } : current)),
      cancel: () => clear(id),
    };
  }, [clear]);

  return (
    <CelebrationContext.Provider value={begin}>
      {children}
      {moment && <Celebration key={moment.id} moment={moment} onDone={clear} />}
    </CelebrationContext.Provider>
  );
}

export function useCelebration() {
  const begin = useContext(CelebrationContext);
  if (!begin) throw new Error("useCelebration needs CelebrationProvider");
  return begin;
}

function Celebration({ moment, onDone }: { moment: Moment; onDone: (id: number) => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { id, kind, confirmed } = moment;

  useEffect(() => {
    if (!confirmed) return;
    const timer = window.setTimeout(() => onDone(id), 1800);
    return () => window.clearTimeout(timer);
  }, [confirmed, id, onDone]);

  useEffect(() => {
    if (!confirmed || !canvas.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;
    const fire = confetti.create(canvas.current, { resize: true, disableForReducedMotion: true });
    const mobile = window.innerWidth < 600;
    const burst = () => {
      for (const left of [true, false]) {
        const base: confetti.Options = {
          origin: { x: left ? 0.12 : 0.88, y: 0.62 },
          angle: left ? 65 : 115,
          colors: ["#fb3aa3", "#ffd046", "#5eeac0", "#ffffff", "#7c7be8"],
          gravity: 1.05, decay: 0.92, ticks: 160,
          shapes: ["square", "square", "circle"],
          scalar: mobile ? 0.85 : 1.1,
        };
        // Mix fast narrow pieces with a slower broad flutter, following the
        // library's Realistic Look recipe rather than a uniform particle fan.
        void fire({ ...base, particleCount: 32, spread: 48, startVelocity: mobile ? 28 : 43 });
        void fire({ ...base, particleCount: 24, spread: 88, startVelocity: mobile ? 19 : 29, scalar: mobile ? 0.65 : 0.85 });
      }
    };
    burst();
    const stop = () => { if (reduced.matches) fire.reset(); };
    reduced.addEventListener("change", stop);
    return () => { fire.reset(); reduced.removeEventListener("change", stop); };
  }, [confirmed]);

  const word = confirmed
    ? kind === "record" ? "Recorded!" : "Welcome!"
    : kind === "record" ? "Recording…" : "Joining…";

  return (
    <div className={`celebration celebration-${kind}${confirmed ? " confirmed" : " pending"}`}>
      <canvas ref={canvas} className="celebration-confetti" aria-hidden="true" />
      <div className="celebration-center">
        <div className="celebration-arrival">
          <div className="celebration-word" key={String(confirmed)} aria-hidden="true">{word}</div>
        </div>
      </div>
      <span className="celebration-status" role="status" aria-live="polite" aria-atomic="true">{word}</span>
    </div>
  );
}
