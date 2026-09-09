"use client";

import Link from "next/link";
import { useState } from "react";
import { RatingGraph, type GraphPoint } from "./rating-graph";

export interface HistoryPerson {
  id: number;
  name: string;
}

export interface HistoryMatch {
  id: number;
  date: string;
  deleted: boolean;
  won: boolean;
  doubles: boolean;
  delta: number | null;
  opponents: HistoryPerson[];
  partners: HistoryPerson[];
}

type Range = 10 | 30 | 0;

function Names({ members }: { members: HistoryPerson[] }) {
  return (
    <>
      {members.map((m, i) => (
        <span key={m.id}>
          {i > 0 && " & "}
          <Link href={`/players/${m.id}`}>{m.name}</Link>
        </span>
      ))}
    </>
  );
}

/**
 * The graph and the match list share one highlighted match, so scrubbing the
 * graph lights up the row and touching a row lights up the point.
 */
export function PlayerHistory({
  points,
  matches,
  startRating,
}: {
  points: GraphPoint[];
  matches: HistoryMatch[];
  startRating: number;
}) {
  const [range, setRange] = useState<Range>(0);
  const [hot, setHot] = useState<number | null | undefined>(undefined);

  const counted = points.length - 1;
  const shown = range && counted > range ? points.slice(points.length - range - 1) : points;
  const shownIds = new Set(shown.map((p) => p.matchId));
  const ranges: { value: Range; label: string }[] = [
    { value: 10, label: "Last 10" },
    { value: 30, label: "Last 30" },
    { value: 0, label: "All" },
  ];

  return (
    <>
      <div className="card graph-card slab">
        <h3>
          Rating
          <span className="ranges" role="tablist" aria-label="Range">
            {ranges.map((r) => (
              <button
                key={r.value}
                type="button"
                role="tab"
                aria-selected={range === r.value}
                className={range === r.value ? "on" : ""}
                disabled={r.value !== 0 && counted <= (r.value === 10 ? 0 : 10)}
                onClick={() => setRange(r.value)}
              >
                {r.label}
              </button>
            ))}
          </span>
        </h3>
        <RatingGraph points={shown} startRating={startRating} hot={hot} onHot={setHot} />
        <div className="legend">
          <span><i className="up" />win</span>
          <span><i className="down" />loss</span>
          <span><i className="base" />start</span>
        </div>
      </div>

      <div className="card slab">
        <h3>
          Matches <span>newest first</span>
        </h3>
        {matches.length === 0 ? (
          <p className="empty">No matches yet. Go play one.</p>
        ) : (
          matches.map((m) => (
            <div
              key={m.id}
              className={`match${m.deleted ? " gone" : ""}${hot === m.id ? " hot" : ""}${!m.deleted && !shownIds.has(m.id) ? " dim" : ""}`}
              onPointerEnter={() => !m.deleted && setHot(m.id)}
              onPointerLeave={() => setHot(undefined)}
              onClick={() => !m.deleted && setHot(hot === m.id ? undefined : m.id)}
            >
              <div>
                <div className="opp">
                  {m.deleted ? "Deleted: " : m.won ? "Beat " : "Lost to "}
                  <Names members={m.opponents} />
                </div>
                <div className="meta">
                  <span className={`type${m.doubles ? " doubles" : ""}${m.deleted ? " deleted" : ""}`}>
                    {m.deleted ? "deleted" : m.doubles ? "doubles" : "singles"}
                  </span>
                  {m.partners.length > 0 && (
                    <span>
                      with <Names members={m.partners} />
                    </span>
                  )}
                  <span>{m.date}</span>
                </div>
              </div>
              <div className={`delta ${m.delta === null ? "none" : m.delta >= 0 ? "up" : "down"}`}>
                {m.delta === null ? "–" : `${m.delta >= 0 ? "+" : ""}${Math.round(m.delta)}`}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
