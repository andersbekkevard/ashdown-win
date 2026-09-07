"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { searchPlayers } from "@/app/actions";
import { MAX_NAME_LENGTH } from "@/lib/config";

export interface Selected {
  id: number;
  name: string;
}

/**
 * One search box. Type a substring, pick a hit. A query that matches nobody
 * offers a link to create that player; it never creates one itself.
 */
export function PlayerSearch({
  label,
  value,
  onChange,
  exclude,
}: {
  label: string;
  value: Selected | null;
  onChange: (next: Selected | null) => void;
  /** Ids already used elsewhere in the match; hidden from results. */
  exclude: number[];
}) {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<Selected[] | null>(null);
  const [searching, setSearching] = useState(false);
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
      <div className="flex items-center gap-2">
        <span className="text-sm">{label}:</span>
        <span className="font-medium">{value.name}</span>
        <button
          type="button"
          onClick={() => {
            onChange(null);
            reset();
          }}
          className="text-sm underline"
        >
          change
        </button>
      </div>
    );
  }

  const visible = hits?.filter((h) => !exclude.includes(h.id)) ?? null;
  const trimmed = query.trim();

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm">
        {label}
      </label>
      <input
        id={inputId}
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        maxLength={MAX_NAME_LENGTH}
        placeholder="Search by name"
        autoComplete="off"
        className="rounded border px-2 py-1"
      />
      {trimmed && (
        <div className="text-sm">
          {searching && visible === null ? (
            <p>Searching…</p>
          ) : visible && visible.length > 0 ? (
            <ul className="flex flex-col">
              {visible.map((h) => (
                <li key={h.id}>
                  <button
                    type="button"
                    onClick={() => onChange(h)}
                    className="w-full py-1 text-left underline"
                  >
                    {h.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : visible ? (
            <p>
              No player matches &ldquo;{trimmed}&rdquo;.{" "}
              <Link
                href={`/players/new?name=${encodeURIComponent(trimmed)}`}
                className="underline"
              >
                Create this player
              </Link>
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
