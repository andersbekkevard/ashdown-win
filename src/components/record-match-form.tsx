"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { recordMatch } from "@/app/actions";
import { PlayerSearch, type Selected } from "./player-search";

type Side = "a" | "b";

export function RecordMatchForm() {
  const router = useRouter();
  const [doubles, setDoubles] = useState(false);
  const [a1, setA1] = useState<Selected | null>(null);
  const [a2, setA2] = useState<Selected | null>(null);
  const [b1, setB1] = useState<Selected | null>(null);
  const [b2, setB2] = useState<Selected | null>(null);
  const [winner, setWinner] = useState<Side | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const chosen = [a1, a2, b1, b2].filter((p): p is Selected => p !== null);
  const exclude = chosen.map((p) => p.id);

  const sideA = doubles ? [a1, a2] : [a1];
  const sideB = doubles ? [b1, b2] : [b1];
  const complete =
    sideA.every((p) => p !== null) &&
    sideB.every((p) => p !== null) &&
    winner !== null;

  const sideLabel = (side: Side, members: (Selected | null)[]) => {
    const names = members.filter((p) => p !== null).map((p) => p.name);
    return names.length ? names.join(" & ") : `Side ${side.toUpperCase()}`;
  };

  function submit() {
    if (!complete || winner === null) return;
    setError(null);
    const toIds = (members: (Selected | null)[]) =>
      members.map((p) => (p as Selected).id);
    startTransition(async () => {
      const result = await recordMatch({
        a: toIds(sideA),
        b: toIds(sideB),
        winner,
      });
      if (result.ok) {
        router.push("/");
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex max-w-md flex-col gap-4"
    >
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={doubles}
          onChange={(e) => {
            setDoubles(e.target.checked);
            if (!e.target.checked) {
              setA2(null);
              setB2(null);
            }
          }}
        />
        Doubles
      </label>

      <fieldset className="flex flex-col gap-2 rounded border p-3">
        <legend className="px-1 text-sm font-medium">Side A</legend>
        <PlayerSearch label="Player" value={a1} onChange={setA1} exclude={exclude} />
        {doubles && (
          <PlayerSearch label="Partner" value={a2} onChange={setA2} exclude={exclude} />
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-2 rounded border p-3">
        <legend className="px-1 text-sm font-medium">Side B</legend>
        <PlayerSearch label="Player" value={b1} onChange={setB1} exclude={exclude} />
        {doubles && (
          <PlayerSearch label="Partner" value={b2} onChange={setB2} exclude={exclude} />
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-2 rounded border p-3">
        <legend className="px-1 text-sm font-medium">Winner</legend>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="winner"
            value="a"
            checked={winner === "a"}
            onChange={() => setWinner("a")}
          />
          {sideLabel("a", sideA)}
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="winner"
            value="b"
            checked={winner === "b"}
            onChange={() => setWinner("b")}
          />
          {sideLabel("b", sideB)}
        </label>
      </fieldset>

      {error && (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!complete || pending}
        className="self-start rounded border px-3 py-1 disabled:opacity-50"
      >
        {pending ? "Recording…" : "Record match"}
      </button>
    </form>
  );
}
