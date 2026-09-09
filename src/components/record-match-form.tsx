"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { recordMatch, type Recorded } from "@/app/actions";
import { RecordedBanner } from "./recorded-banner";
import { Crown } from "./crown";
import { Dock } from "./dock";
import { PlayerSearch, type Selected } from "./player-search";

type Side = "a" | "b";

export function RecordMatchForm({ roster }: { roster: Selected[] }) {
  const router = useRouter();
  const [doubles, setDoubles] = useState(false);
  const [a1, setA1] = useState<Selected | null>(null);
  const [known, setKnown] = useState<Selected[]>(roster);
  const [a2, setA2] = useState<Selected | null>(null);
  const [b1, setB1] = useState<Selected | null>(null);
  const [b2, setB2] = useState<Selected | null>(null);
  const [winner, setWinner] = useState<Side | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ result: Recorded; a: Selected[]; b: Selected[]; winner: Side } | null>(null);
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
    if (!complete || winner === null) return;
    setError(null);
    const toIds = (members: (Selected | null)[]) => members.map((p) => (p as Selected).id);
    startTransition(async () => {
      const result = await recordMatch({ a: toIds(sideA), b: toIds(sideB), winner });
      if (result.ok) {
        setDone({ result: result.value, a: sideA as Selected[], b: sideB as Selected[], winner });
        router.refresh();
      } else {
        setError(result.error);
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
        <PlayerSearch placeholder="Player" value={a1} onChange={adopt(setA1)} exclude={exclude} roster={known} autoFocus />
        {doubles && (
          <PlayerSearch placeholder="Partner" value={a2} onChange={adopt(setA2)} exclude={exclude} roster={known} />
        )}
      </div>
      <div className="vs">VS</div>
      <div className="side b slab">
        <div className="label">Side B</div>
        <PlayerSearch placeholder="Player" value={b1} onChange={adopt(setB1)} exclude={exclude} roster={known} />
        {doubles && (
          <PlayerSearch placeholder="Partner" value={b2} onChange={adopt(setB2)} exclude={exclude} roster={known} />
        )}
      </div>

      <div className="winner-title">Who won?</div>
      <div className="winners">
        {tile("a", sideA)}
        {tile("b", sideB)}
      </div>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {done &&
        createPortal(
          <RecordedBanner
            a={done.a}
            b={done.b}
            winner={done.winner}
            deltaA={done.result.deltaA}
            onBoard={() => {
              router.push("/");
            }}
            onAgain={() => {
              setDone(null);
              setA1(null);
              setA2(null);
              setB1(null);
              setB2(null);
              setWinner(null);
            }}
          />,
          document.body,
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
