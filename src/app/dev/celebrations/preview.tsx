"use client";

import { useEffect, useRef, useState } from "react";
import { useCelebration } from "@/components/celebration";

export function CelebrationPreview() {
  const celebrate = useCelebration();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [delay, setDelay] = useState(150);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function play(kind: "record" | "welcome", fail = false) {
    if (timer.current) clearTimeout(timer.current);
    const ticket = celebrate(kind);
    timer.current = setTimeout(fail ? ticket.cancel : ticket.confirm, delay);
  }

  return (
    <div className="form-card slab">
      <h1>Celebrations</h1>
      <p>Development preview. These buttons do not save any data.</p>
      <label htmlFor="save-delay">Simulated save</label>
      <select id="save-delay" value={delay} onChange={(e) => setDelay(Number(e.target.value))}>
        <option value={150}>Fast · 150 ms</option>
        <option value={1500}>Slow · 1.5 seconds</option>
      </select>
      <p><button className="btn" onClick={() => play("record")}>Recorded!</button></p>
      <p><button className="btn lilac" onClick={() => play("welcome")}>Welcome!</button></p>
      <p><button className="btn ghost" onClick={() => play("record", true)}>Failed save</button></p>
    </div>
  );
}
