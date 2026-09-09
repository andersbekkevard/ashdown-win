"use client";

import { useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { searchPlayers } from "@/app/actions";
import { MAX_NAME_LENGTH } from "@/lib/config";
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
 * One search box. Type a substring, pick a hit. A query that matches nobody
 * offers a link to create that player; it never creates one itself.
 */
export function PlayerSearch({
  placeholder,
  value,
  onChange,
  exclude,
  autoFocus = false,
}: {
  placeholder: string;
  value: Selected | null;
  onChange: (next: Selected | null) => void;
  /** Ids already used elsewhere in the match; hidden from results. */
  exclude: number[];
  autoFocus?: boolean;
}) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Selected[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [creating, setCreating] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestId = useRef(0);

  function reset() {
    if (timer.current) clearTimeout(timer.current);
    requestId.current += 1;
    setQuery("");
    setHits(null);
    setSearching(false);
  }

  function onQueryChange(next: string) {
    setQuery(next);
    if (timer.current) clearTimeout(timer.current);
    const id = ++requestId.current;
    const q = next.trim();
    if (!q) {
      setHits(null);
      setSearching(false);
      return;
    }
    setSearching(true);
    timer.current = setTimeout(async () => {
      const result = await searchPlayers(q);
      if (id === requestId.current) {
        setHits(result);
        setSearching(false);
      }
    }, 150);
  }

  if (value) {
    return (
      <div className="picked pop-in">
        <b>{value.name}</b>
        <button
          type="button"
          onClick={() => {
            onChange(null);
            reset();
          }}
        >
          change
        </button>
      </div>
    );
  }

  const visible = hits?.filter((h) => !exclude.includes(h.id)) ?? null;
  const trimmed = query.trim();

  return (
    <div className="field">
      <PaddleIcon />
      <input
        id={inputId}
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        maxLength={MAX_NAME_LENGTH}
        placeholder={placeholder}
        autoComplete="off"
        autoCapitalize="words"
        enterKeyHint="search"
        autoFocus={autoFocus}
        aria-label={placeholder}
      />
      {trimmed && (
        <div className="sugg pop-in">
          {searching && visible === null ? (
            <div className="hint">Searching…</div>
          ) : visible && visible.length > 0 ? (
            visible.map((h) => (
              <button key={h.id} type="button" onClick={() => onChange(h)}>
                {h.name}
              </button>
            ))
          ) : visible ? (
            <button type="button" className="create" onClick={() => setCreating(trimmed)}>
              <span>No one called &ldquo;{trimmed}&rdquo;</span>
              <b>Create</b>
            </button>
          ) : null}
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
                  reset();
                  onChange(p);
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
