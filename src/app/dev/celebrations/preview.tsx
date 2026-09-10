"use client";

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { useCelebration } from "@/components/celebration";
import { confettiSettingsSchema, defaultConfettiSettings, type ConfettiSettings } from "@/lib/confetti-settings";
import styles from "./preview.module.css";

const STORAGE_KEY = "ashdown-confetti-workbench-v1";
const subscribe = () => () => {};

/** Mount after hydration so saved, device-specific settings never change server HTML. */
export function CelebrationPreview() {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  return mounted ? <ConfettiControls /> : <p>Loading confetti controls…</p>;
}

function initialSettings(): ConfettiSettings {
  try {
    const saved = confettiSettingsSchema.safeParse(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null"));
    if (saved.success) return saved.data;
  } catch { /* A private browser may not allow local storage. */ }
  return defaultConfettiSettings(window.innerWidth < 600);
}

function Slider({ label, value, min, max, step = 1, unit = "", onChange }: {
  label: string; value: number; min: number; max: number; step?: number; unit?: string;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <div className={styles.slider}>
      <div><label htmlFor={id}>{label}</label><output htmlFor={id}>{Number(value.toFixed(3))}{unit}</output></div>
      <input id={id} type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

function ConfettiControls() {
  const celebrate = useCelebration();
  const [settings, setSettings] = useState(initialSettings);
  const [delay, setDelay] = useState(150);
  const [autoReplay, setAutoReplay] = useState(false);
  const [feedback, setFeedback] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancel = useRef<(() => void) | null>(null);
  const jsonField = useRef<HTMLTextAreaElement>(null);

  const stop = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    cancel.current?.();
  }, []);
  useEffect(() => stop, [stop]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); }
    catch { /* Copy settings remains available when storage is disabled. */ }
  }, [settings]);

  const play = useCallback((kind: "record" | "welcome", fail = false) => {
    stop();
    const ticket = celebrate(kind, settings);
    cancel.current = ticket.cancel;
    timer.current = setTimeout(fail ? ticket.cancel : ticket.confirm, delay);
  }, [celebrate, delay, settings, stop]);

  useEffect(() => {
    if (!autoReplay) return;
    const replay = setTimeout(() => play("record"), 250);
    return () => clearTimeout(replay);
  }, [autoReplay, play]);

  function update(patch: Partial<ConfettiSettings>) {
    setSettings((current) => ({ ...current, ...patch }));
    setFeedback("");
  }

  function reset(mobile: boolean) {
    stop();
    setSettings(defaultConfettiSettings(mobile));
    setFeedback(mobile ? "Phone defaults restored." : "Desktop defaults restored.");
  }

  async function copySettings() {
    const json = JSON.stringify(settings, null, 2);
    try {
      if (!navigator.clipboard) throw new Error("Use selection on HTTP previews");
      await navigator.clipboard.writeText(json);
      setFeedback("Settings copied. Paste them into our conversation.");
    } catch {
      // The private IP preview uses HTTP, where the modern clipboard API is
      // unavailable. Keep a selectable fallback for iPhone and desktop.
      jsonField.current?.focus();
      jsonField.current?.select();
      jsonField.current?.setSelectionRange(0, json.length);
      let copied = false;
      try { copied = document.execCommand("copy"); } catch { /* Manual copy below. */ }
      setFeedback(copied ? "Settings copied. Paste them into our conversation." : "Settings selected. Use Copy, then paste them into our conversation.");
    }
  }

  const total = settings.bursts.reduce((count, burst) => count + burst.particleCount, 0) * 2;

  return (
    <div className={styles.workbench}>
      <header className={`${styles.intro} slab`}>
        <h1>Confetti studio</h1>
        <p>Tune it, replay it, then copy your settings. Nothing here records matches or changes the live defaults.</p>
        <div className={styles.presets}>
          <button onClick={() => reset(true)}>Reset to phone</button>
          <button onClick={() => reset(false)}>Reset to desktop</button>
        </div>
      </header>

      <div className={styles.replay}>
        <div className={styles.replayButtons}>
          <button onClick={() => play("record")}>Recorded!</button>
          <button onClick={() => play("welcome")}>Welcome!</button>
          <button onClick={() => { setAutoReplay(false); stop(); }}>Stop</button>
        </div>
        <label className={styles.check}>
          <input type="checkbox" checked={autoReplay} onChange={(e) => setAutoReplay(e.target.checked)} />
          Replay as I adjust
        </label>
      </div>

      <details className={`${styles.section} slab`} open>
        <summary>Cannon positions & angles</summary>
        <p>0–100% is on screen. Go below 0 or above 100 to launch from outside. At 90°, a cannon shoots straight up.</p>
        {(["left", "right"] as const).map((side) => (
          <div key={side} className={styles.group}>
            <h2>{side === "left" ? "Left cannon" : "Right cannon"}</h2>
            <Slider label="Horizontal position" value={settings[side].x * 100} min={-50} max={150} unit="%"
              onChange={(x) => update({ [side]: { ...settings[side], x: x / 100 } })} />
            <Slider label="Vertical position" value={settings[side].y * 100} min={-50} max={150} unit="%"
              onChange={(y) => update({ [side]: { ...settings[side], y: y / 100 } })} />
            <Slider label="Launch angle" value={settings[side].angle} min={0} max={360} unit="°"
              onChange={(angle) => update({ [side]: { ...settings[side], angle } })} />
          </div>
        ))}
      </details>

      <details className={`${styles.section} slab`} open>
        <summary>Particles · {total} in total</summary>
        <p>Each cannon fires two groups. Set a count to zero to turn that group off.</p>
        {settings.bursts.map((burst, index) => {
          const change = (patch: Partial<typeof burst>) => {
            const bursts: ConfettiSettings["bursts"] = [...settings.bursts];
            bursts[index] = { ...burst, ...patch };
            update({ bursts });
          };
          return (
            <div key={index} className={styles.group}>
              <h2>{index === 0 ? "Main burst" : "Broad flutter"}</h2>
              <Slider label="Count per cannon" value={burst.particleCount} min={0} max={200}
                onChange={(particleCount) => change({ particleCount })} />
              <Slider label="Launch speed" value={burst.startVelocity} min={0} max={100}
                onChange={(startVelocity) => change({ startVelocity })} />
              <Slider label="Particle size" value={burst.scalar} min={0.1} max={6} step={0.01} unit="×"
                onChange={(scalar) => change({ scalar })} />
              <Slider label="Spread" value={burst.spread} min={0} max={360} unit="°"
                onChange={(spread) => change({ spread })} />
            </div>
          );
        })}
      </details>

      <details className={`${styles.section} slab`}>
        <summary>Physics & lifetime</summary>
        <p>Less gravity floats; negative gravity rises. Speed retention closer to 1 carries pieces farther. Negative drift goes left.</p>
        <Slider label="Gravity" value={settings.gravity} min={-2} max={4} step={0.05} onChange={(gravity) => update({ gravity })} />
        <Slider label="Speed retention" value={settings.decay} min={0} max={1} step={0.005} onChange={(decay) => update({ decay })} />
        <Slider label="Sideways drift" value={settings.drift} min={-5} max={5} step={0.1} onChange={(drift) => update({ drift })} />
        <Slider label="Particle lifetime" value={settings.ticks} min={30} max={600} unit=" ticks" onChange={(ticks) => update({ ticks })} />
        <Slider label="Whole animation duration" value={settings.durationMs} min={500} max={10000} step={100} unit=" ms" onChange={(durationMs) => update({ durationMs })} />
        <p>The whole animation duration also controls the text and final fade; it can end before a particle&apos;s lifetime.</p>
        <label className={styles.check}><input type="checkbox" checked={settings.flat} onChange={(e) => update({ flat: e.target.checked })} />Flat pieces · no tumbling</label>
      </details>

      <details className={`${styles.section} slab`}>
        <summary>Colors & shapes</summary>
        <div className={styles.colors}>
          {settings.colors.map((color, index) => (
            <div key={index}>
              <input type="color" aria-label={`Color ${index + 1}`} value={color}
                onChange={(e) => update({ colors: settings.colors.map((value, i) => i === index ? e.target.value : value) })} />
              <button aria-label={`Remove color ${index + 1}`} disabled={settings.colors.length === 1}
                onClick={() => update({ colors: settings.colors.filter((_, i) => i !== index) })}>×</button>
            </div>
          ))}
        </div>
        <button className={styles.secondary} disabled={settings.colors.length >= 8}
          onClick={() => update({ colors: [...settings.colors, "#00b5fe"] })}>Add color</button>
        <p>Shape weights control the mix. Zero removes a shape; at least one must remain.</p>
        {(["square", "circle", "star"] as const).map((shape) => (
          <Slider key={shape} label={`${shape === "square" ? "Paper" : shape === "circle" ? "Circle" : "Star"} weight`}
            value={settings.shapes[shape]} min={0} max={5} onChange={(weight) => {
              const shapes = { ...settings.shapes, [shape]: weight };
              if (Object.values(shapes).some((value) => value > 0)) update({ shapes });
            }} />
        ))}
      </details>

      <details className={`${styles.section} slab`}>
        <summary>Save timing</summary>
        <Slider label="Simulated save delay" value={delay} min={0} max={5000} step={50} unit=" ms" onChange={setDelay} />
        <button className={styles.secondary} onClick={() => play("record", true)}>Preview failed save</button>
      </details>

      <details className={`${styles.section} slab`}>
        <summary>Copy my settings</summary>
        <p>Paste these into our conversation when you&apos;re happy with the result.</p>
        <textarea ref={jsonField} aria-label="Confetti settings JSON" value={JSON.stringify(settings, null, 2)} readOnly rows={12} />
        <button className={styles.secondary} onClick={copySettings}>Copy settings</button>
      </details>
      <p className={styles.feedback} role="status">{feedback}</p>
    </div>
  );
}
