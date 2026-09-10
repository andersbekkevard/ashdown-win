"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MAX_NAME_LENGTH } from "@/lib/config";
import { normalizeName } from "@/lib/names";
import { CreatePlayerForm } from "./create-player-form";

export interface Selected {
  id: number;
  name: string;
}

function PaddleIcon() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10" cy="9" r="7" fill="#FB3AA3" stroke="#222126" strokeWidth="2" />
      <path d="M14.5 14.5 L20 20" stroke="#222126" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}


/**
 * One picker. The whole roster is already on the client, most recently
 * active first, so the list opens the moment the box is focused and filters
 * as you type with no round trip. A name that matches nobody offers to
 * create that player in a sheet; it never creates one silently.
 */
export function PlayerSearch({
  placeholder,
  value,
  onChange,
  exclude,
  roster,
  autoFocus = false,
  active = false,
}: {
  placeholder: string;
  value: Selected | null;
  onChange: (next: Selected | null) => void;
  /** Ids already used elsewhere in the match; hidden from results. */
  exclude: number[];
  roster: Selected[];
  autoFocus?: boolean;
  /** True for the slot the form wants filled next; it focuses and opens. */
  active?: boolean;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  // The autofocused first field gets no focus event, so start open there.
  const [open, setOpen] = useState(autoFocus);
  const [creating, setCreating] = useState<string | null>(null);

  // Focusing fires onFocus, which opens the list; no state is set here.
  // Focusing fires onFocus, which opens the list; then bring the field to the
  // top of the scroll area so the whole list is visible above the dock.
  useEffect(() => {
    if (active && !value) {
      const el = inputRef.current;
      el?.focus({ preventScroll: true });
      el?.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, [active, value]);

  // Size the open list to the room between the field and the dock, so it is
  // never hidden under the action bar however far the page could scroll.
  useEffect(() => {
    if (!open) return;
    const fit = () => {
      const el = listRef.current;
      const inp = inputRef.current;
      if (!el || !inp) return;
      const dock = document.querySelector(".dock");
      const dockTop = dock ? dock.getBoundingClientRect().top : window.innerHeight;
      const room = dockTop - inp.getBoundingClientRect().bottom - 14;
      el.style.maxHeight = `${Math.max(150, Math.round(room))}px`;
    };
    fit();
    const t = setTimeout(fit, 450);
    window.addEventListener("resize", fit);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", fit);
    };
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
  const shown = hits;
  const exact = q && available.some((p) => p.name.toLowerCase() === q);
  const trimmed = normalizeName(query);

  function pick(p: Selected) {
    onChange(p);
    setQuery("");
    setOpen(false);
  }

  return (
    <div className={`field${open ? " open" : ""}`}>
      <PaddleIcon />
      <input
        ref={inputRef}
        id={inputId}
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        onBlur={(e) => {
          const el = e.currentTarget;
          setTimeout(() => {
            if (document.activeElement !== el) setOpen(false);
          }, 150);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && shown.length > 0) {
            e.preventDefault();
            pick(shown[0]);
          }
        }}
        maxLength={MAX_NAME_LENGTH}
        placeholder={placeholder}
        autoComplete="off"
        autoCapitalize="words"
        enterKeyHint="search"
        autoFocus={autoFocus}
        aria-label={placeholder}
      />
      {open && (
        <div className="sugg pop-in" role="listbox" ref={listRef}>
          {!q && shown.length > 0 && <div className="hint">Recently at the table</div>}
          {shown.map((h) => (
            <button key={h.id} type="button" role="option" aria-selected={false} onPointerDown={(e) => { e.preventDefault(); pick(h); }} onClick={() => pick(h)}>
              {h.name}
            </button>
          ))}
          {q && !exact && trimmed && (
            <button type="button" className="create" onPointerDown={(e) => { e.preventDefault(); setCreating(trimmed); }} onClick={() => setCreating(trimmed)}>
              <span>{shown.length ? "Not them?" : `No one called “${trimmed}”`}</span>
              <b>Create &ldquo;{trimmed}&rdquo;</b>
            </button>
          )}
          {!q && available.length === 0 && <div className="hint">No other players yet. Type a name to create one.</div>}
        </div>
      )}
      {creating !== null &&
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
    </div>
  );
}
