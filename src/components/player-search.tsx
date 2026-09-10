"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { MAX_NAME_LENGTH } from "@/lib/config";
import { normalizeName } from "@/lib/names";
import { CreatePlayerForm } from "./create-player-form";

export interface Selected {
  id: number;
  name: string;
}

const TONES = { a: "#00b5fe", b: "#fb3aa3" } as const;

function PaddleIcon({ className = "ico", colour = "#FB3AA3" }: { className?: string; colour?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10" cy="9" r="7" fill={colour} stroke="#222126" strokeWidth="2" />
      <path d="M14.5 14.5 L20 20" stroke="#222126" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * One slot of the match form. The slot itself is a button; choosing opens a
 * full-height picker sheet in the iOS manner: a search field pinned at the
 * top and a scrolling list under it. The sheet closes only on a pick, the
 * Done button, or Escape, never because the field lost focus, so the list
 * can be scrolled freely with or without the keyboard.
 */
export function PlayerSearch({
  placeholder,
  value,
  onChange,
  exclude,
  roster,
  active = false,
  side = "a",
}: {
  placeholder: string;
  value: Selected | null;
  onChange: (next: Selected | null) => void;
  /** Ids already used elsewhere in the match; hidden from results. */
  exclude: number[];
  roster: Selected[];
  /** True for the slot the form wants filled next; it opens the sheet. */
  active?: boolean;
  /** Which side the slot belongs to; colours the paddle and the sheet label. */
  side?: "a" | "b";
  /** Kept for callers; the sheet handles focus itself. */
  autoFocus?: boolean;
}) {
  const [opened, setOpened] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const colour = TONES[side];
  // Portals need document; render them only once mounted on the client.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  // The form asks the next empty slot to open; Done or Escape dismisses it
  // until the slot is tapped again. Derived, so no state is set in an effect.
  const open = opened || (active && !value && !dismissed);
  const setOpen = (next: boolean) => {
    setOpened(next);
    setDismissed(!next);
  };

  // Focus the search field once the sheet is up. iOS raises the keyboard when
  // this follows a tap, and leaves the list usable when it does not.
  useEffect(() => {
    if (open) inputRef.current?.focus({ preventScroll: true });
  }, [open]);

  // Keep the sheet exactly the size of the visible area, so when the iOS
  // keyboard comes up the search field stays put and only the list scrolls.
  useEffect(() => {
    if (!open) return;
    const vv = window.visualViewport;
    const fit = () => {
      const el = sheetRef.current;
      if (!el) return;
      const h = vv ? vv.height : window.innerHeight;
      const top = vv ? vv.offsetTop : 0;
      el.style.height = `${Math.round(h)}px`;
      el.style.top = `${Math.round(top)}px`;
    };
    fit();
    vv?.addEventListener("resize", fit);
    vv?.addEventListener("scroll", fit);
    window.addEventListener("resize", fit);
    return () => {
      vv?.removeEventListener("resize", fit);
      vv?.removeEventListener("scroll", fit);
      window.removeEventListener("resize", fit);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (value) {
    return (
      <div className="picked pop-in">
        <b>{value.name}</b>
        <button
          type="button"
          onClick={() => {
            onChange(null);
            setQuery("");
            setOpen(true);
          }}
        >
          change
        </button>
      </div>
    );
  }

  const q = normalizeName(query).toLowerCase();
  const available = roster.filter((p) => !exclude.includes(p.id));
  const hits = q ? available.filter((p) => p.name.toLowerCase().includes(q)) : available;
  const exact = q && available.some((p) => p.name.toLowerCase() === q);
  const trimmed = normalizeName(query);

  function pick(p: Selected) {
    onChange(p);
    setQuery("");
    setOpen(false);
  }

  return (
    <>
      <button type="button" className="slot" onClick={() => setOpen(true)}>
        <PaddleIcon colour={colour} />
        <span>{placeholder}</span>
        <span className="slot-go">Choose ›</span>
      </button>

      {open &&
        mounted &&
        createPortal(
          <div className="picker" role="dialog" aria-modal="true" aria-label={`Choose ${placeholder.toLowerCase()}`} ref={sheetRef}>
            <div className="picker-head">
              <span className="picker-side" style={{ background: colour }}>
                Side {side.toUpperCase()}
              </span>
              <div className="field picker-field">
                <PaddleIcon colour={colour} />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && hits.length > 0) {
                      e.preventDefault();
                      pick(hits[0]);
                    }
                  }}
                  maxLength={MAX_NAME_LENGTH}
                  placeholder="Search"
                  autoComplete="off"
                  autoCapitalize="words"
                  enterKeyHint="search"
                  aria-label={placeholder}
                />
              </div>
              <button type="button" className="chip picker-done" onClick={() => setOpen(false)}>
                Done
              </button>
            </div>
            <div className="picker-list" role="listbox">
              {!q && hits.length > 0 && <div className="hint">Recently at the table</div>}
              {hits.map((h) => (
                <button key={h.id} type="button" role="option" aria-selected={false} onClick={() => pick(h)}>
                  {h.name}
                </button>
              ))}
              {q && !exact && trimmed && (
                <button type="button" className="create" onClick={() => setCreating(trimmed)}>
                  <span>{hits.length ? "Not them?" : `No one called “${trimmed}”`}</span>
                  <b>Create &ldquo;{trimmed}&rdquo;</b>
                </button>
              )}
              {!q && available.length === 0 && <div className="hint">No other players yet. Type a name to create one.</div>}
              {q && hits.length === 0 && exact && <div className="hint">Already in this match.</div>}
            </div>
          </div>,
          document.body,
        )}

      {creating !== null &&
        mounted &&
        createPortal(
          <div className="sheet-wrap" role="dialog" aria-modal="true" aria-label="Create player">
            <div className="sheet pop-in">
              <CreatePlayerForm
                initialName={creating}
                variant="sheet"
                onCreated={(p) => {
                  setCreating(null);
                  pick(p);
                }}
                onCancel={() => setCreating(null)}
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
