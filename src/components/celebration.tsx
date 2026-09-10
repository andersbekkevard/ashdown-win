"use client";

import confetti from "canvas-confetti";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { defaultConfettiSettings, type ConfettiSettings } from "@/lib/confetti-settings";

type Kind = "record" | "welcome";
type Moment = { id: number; kind: Kind; confirmed: boolean; settings: ConfettiSettings };
type Ticket = { confirm: () => void; cancel: () => void };
const CelebrationContext = createContext<((kind: Kind, settings?: ConfettiSettings) => Ticket) | null>(null);

/** Lives above routes: the click starts motion and a confirmed save survives navigation. */
export function CelebrationProvider({ children }: { children: ReactNode }) {
  const [moment, setMoment] = useState<Moment | null>(null);
  const sequence = useRef(0);
  const clear = useCallback((id: number) => {
    setMoment((current) => current?.id === id ? null : current);
  }, []);
  const begin = useCallback((kind: Kind, settings?: ConfettiSettings): Ticket => {
    const id = ++sequence.current;
    setMoment({ id, kind, confirmed: false, settings: settings ?? defaultConfettiSettings(window.innerWidth < 600) });
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
  const { id, kind, confirmed, settings } = moment;

  useEffect(() => {
    if (!confirmed) return;
    const timer = window.setTimeout(() => onDone(id), settings.durationMs);
    return () => window.clearTimeout(timer);
  }, [confirmed, id, onDone, settings.durationMs]);

  useEffect(() => {
    if (!confirmed || !canvas.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;
    const fire = confetti.create(canvas.current, { resize: true, disableForReducedMotion: true });
    const shapes = (Object.keys(settings.shapes) as (keyof ConfettiSettings["shapes"])[])
      .flatMap((shape) => Array.from({ length: settings.shapes[shape] }, () => shape));
    for (const cannon of [settings.left, settings.right]) {
      for (const burst of settings.bursts) {
        const base: confetti.Options = {
          origin: { x: cannon.x, y: cannon.y },
          angle: cannon.angle,
          colors: settings.colors,
          gravity: settings.gravity,
          decay: settings.decay,
          drift: settings.drift,
          ticks: settings.ticks,
          flat: settings.flat,
          shapes,
          ...burst,
        };
        void fire(base);
      }
    }
    const stop = () => { if (reduced.matches) fire.reset(); };
    reduced.addEventListener("change", stop);
    return () => { fire.reset(); reduced.removeEventListener("change", stop); };
  }, [confirmed, settings]);

  const word = confirmed
    ? kind === "record" ? "Recorded!" : "Welcome!"
    : kind === "record" ? "Recording…" : "Joining…";

  return (
    <div
      className={`celebration celebration-${kind}${confirmed ? " confirmed" : " pending"}`}
      style={{ "--celebration-duration": `${settings.durationMs}ms` } as CSSProperties}
    >
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
