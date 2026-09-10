"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { recordMatch } from "@/app/actions";
import { Crown } from "./crown";
import { Dock } from "./dock";
import { useCelebration } from "./celebration";
import { PlayerSearch, type Selected } from "./player-search";

type Side = "a" | "b";

export function RecordMatchForm({ roster }: { roster: Selected[] }) {
  const router = useRouter();
  const celebrate = useCelebration();
  const [doubles, setDoubles] = useState(false);
  const [a1, setA1] = useState<Selected | null>(null);
  const [known, setKnown] = useState<Selected[]>(roster);
  const [a2, setA2] = useState<Selected | null>(null);
  const [b1, setB1] = useState<Selected | null>(null);
  const [b2, setB2] = useState<Selected | null>(null);
  const [winner, setWinner] = useState<Side | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const chosen = [a1, a2, b1, b2].filter((p): p is Selected => p !== null);
  // A player created from inside the form joins the roster for the other slots.
  const adopt = (setter: (p: Selected | null) => void) => (p: Selected | null) => {
    if (p && !known.some((k) => k.id === p.id)) setKnown([p, ...known]);
    setter(p);
  };
  const exclude = chosen.map((p) => p.id);

  const sideA = doubles ? [a1, a2] : [a1];
  const sideB = doubles ? [b1, b2] : [b1];
  // The next empty slot, in reading order, gets focus and an open list.
  const order = doubles ? ["a1", "a2", "b1", "b2"] : ["a1", "b1"];
  const filled: Record<string, Selected | null> = { a1, a2, b1, b2 };
  const next = order.find((k) => filled[k] === null) ?? null;
  // Once every slot is filled, bring the winner tiles into view above the dock.
  const winnersRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (next === null && winner === null) {
      winnersRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    }
  }, [next, winner]);
  const complete =
    sideA.every((p) => p !== null) && sideB.every((p) => p !== null) && winner !== null;

  const names = (members: (Selected | null)[]) =>
    members.filter((p): p is Selected => p !== null).map((p) => p.name).join(" & ");

  function toggleDoubles() {
    const next = !doubles;
    setDoubles(next);
    if (!next) {
      setA2(null);
      setB2(null);
    }
  }

  function submit() {
    if (!complete || winner === null || pending) return;
    setError(null);
    const celebration = celebrate("record");
    const toIds = (members: (Selected | null)[]) => members.map((p) => (p as Selected).id);
    startTransition(async () => {
      try {
        const result = await recordMatch({ a: toIds(sideA), b: toIds(sideB), winner });
        if (result.ok) {
          celebration.confirm();
          router.push("/");
        } else {
          celebration.cancel();
          setError(result.error);
        }
      } catch {
        celebration.cancel();
        setError("Could not confirm the save. Check the log before trying again.");
      }
    });
  }

  const tile = (side: Side, members: (Selected | null)[]) => {
    const label = names(members);
    const on = winner === side;
    return (
      <button
        type="button"
        className={`win ${side}${on ? " on" : ""}`}
        onClick={() => setWinner(side)}
        aria-pressed={on}
      >
        <Crown className="crown" />
        <div className={`wname${label ? "" : " empty"}`}>{label || "Pick a side first"}</div>
        <div className="tag">{side === "a" ? "Side A" : "Side B"}</div>
      </button>
    );
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div
        className={`toggle-row slab${doubles ? " on" : ""}`}
        onClick={toggleDoubles}
        role="presentation"
      >
        <div className="tlabel">
          <b>{doubles ? "Doubles" : "Singles"}</b>
          <span>{doubles ? "Two on each side, half the K" : "Flip for doubles"}</span>
        </div>
        <button
          type="button"
          className="switch"
          role="switch"
          aria-checked={doubles}
          aria-label="Doubles"
          onClick={(e) => {
            e.stopPropagation();
            toggleDoubles();
          }}
        >
          <span className="knob">{doubles ? "2v2" : "1v1"}</span>
        </button>
      </div>

      <div className="side a slab">
        <div className="label">Side A</div>
        <PlayerSearch placeholder="Player" value={a1} onChange={adopt(setA1)} exclude={exclude} roster={known} autoFocus active={next === "a1"} />
        {doubles && (
          <PlayerSearch placeholder="Partner" value={a2} onChange={adopt(setA2)} exclude={exclude} roster={known} active={next === "a2"} />
        )}
      </div>
      <div className="vs">VS</div>
      <div className="side b slab">
        <div className="label">Side B</div>
        <PlayerSearch placeholder="Player" value={b1} onChange={adopt(setB1)} exclude={exclude} roster={known} active={next === "b1"} />
        {doubles && (
          <PlayerSearch placeholder="Partner" value={b2} onChange={adopt(setB2)} exclude={exclude} roster={known} active={next === "b2"} />
        )}
      </div>

      <div className="winner-title">Who won?</div>
      <div className="winners" ref={winnersRef}>
        {tile("a", sideA)}
        {tile("b", sideB)}
      </div>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <Dock>
        <Link href="/" className="btn ghost">
          Cancel
        </Link>
        <button type="submit" className="btn" disabled={!complete || pending}>
          {pending ? "Recording…" : "Record it"}
        </button>
      </Dock>
    </form>
  );
}
