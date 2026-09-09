"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createPlayer, type ActionResult } from "@/app/actions";
import { MAX_NAME_LENGTH } from "@/lib/config";
import { Dock } from "./dock";

type Created = { id: number; name: string };

/**
 * The one moment the site speaks to a person as themselves. As a page it
 * navigates to the new player; as a sheet (inside the match form) it hands
 * the new player back and stays put. Deliberately not a <form>, so it can
 * sit inside the match form without nesting.
 */
export function CreatePlayerForm({
  initialName,
  variant = "page",
  onCreated,
  onCancel,
}: {
  initialName: string;
  variant?: "page" | "sheet";
  onCreated?: (player: Created) => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [state, setState] = useState<ActionResult<Created> | null>(null);
  const [pending, start] = useTransition();

  function submit() {
    if (pending) return;
    start(async () => {
      const result = await createPlayer(name);
      setState(result);
      if (result.ok) {
        if (variant === "sheet" && onCreated) {
          onCreated(result.value);
        } else {
          router.push(`/players/${result.value.id}?welcome`);
          router.refresh();
        }
      }
    });
  }

  const buttons = (
    <>
      {variant === "sheet" ? (
        <button type="button" className="btn ghost" onClick={onCancel}>
          Back
        </button>
      ) : (
        <Link href="/" className="btn ghost">
          Cancel
        </Link>
      )}
      <button type="button" className="btn lilac" disabled={pending || !name.trim()} onClick={submit}>
        {pending ? "Creating…" : "Create"}
      </button>
    </>
  );

  return (
    <div>
      <div className={`form-card slab pop-in${variant === "sheet" ? " in-sheet" : ""}`}>
        <h2 className="shout">New player</h2>
        <label htmlFor="name">Your name</label>
        <div className="field plain">
          <input
            id="name"
            type="text"
            name="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (state && !state.ok) setState(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }
            }}
            maxLength={MAX_NAME_LENGTH}
            required
            autoFocus
            autoComplete="name"
            autoCapitalize="words"
            enterKeyHint="done"
            placeholder="Full name"
          />
        </div>
        {name.length >= MAX_NAME_LENGTH - 15 && (
          <p className={`counter${name.length >= MAX_NAME_LENGTH ? " full" : ""}`}>
            {name.length} of {MAX_NAME_LENGTH} characters
          </p>
        )}
        <p className="hint">
          Anyone can record a match against you by finding this name.
        </p>
        <details>
          <summary>I&apos;d rather not use my full name</summary>
          <div className="altbox">
            <p>
              Use your MIT username instead, the part of your email before the @. It is unique,
              so nobody else can take it.
            </p>
            <p>
              Or any other name you know to be unique. Remember that the people who record
              matches against you will have to find it.
            </p>
          </div>
        </details>

        {state && !state.ok && (
          <div className="error" role="alert">
            <p style={{ margin: 0 }}>{state.error}</p>
            {state.existing && (
              <p style={{ margin: "6px 0 0" }}>
                Did you mean{" "}
                {variant === "sheet" && onCreated ? (
                  <button type="button" className="linkish" onClick={() => onCreated(state.existing!)}>
                    {state.existing.name}
                  </button>
                ) : (
                  <Link href={`/players/${state.existing.id}`} style={{ textDecoration: "underline" }}>
                    {state.existing.name}
                  </Link>
                )}
                ?
              </p>
            )}
          </div>
        )}
        {variant === "sheet" && <div className="sheet-buttons">{buttons}</div>}
      </div>
      {variant === "page" && <Dock>{buttons}</Dock>}
    </div>
  );
}
