"use client";

import { useRef } from "react";

export interface GraphPoint {
  /** Match behind this point; null for the starting point. */
  matchId: number | null;
  rating: number;
  delta: number | null;
  /** Opponent or partner text for the tooltip; empty for the start point. */
  who: string;
  date: string;
}

/**
 * Rating over time, drawn by hand in SVG. Points are evenly spaced by match,
 * since Elo moves per match. Hover or drag across the graph to scrub through
 * the trajectory; the parent owns the highlighted match so a list can follow.
 */
export function RatingGraph({
  points,
  startRating,
  hot,
  onHot,
}: {
  points: GraphPoint[];
  startRating: number;
  /** Highlighted match id; null for the start point; undefined for none. */
  hot: number | null | undefined;
  onHot: (matchId: number | null | undefined) => void;
}) {
  const wrap = useRef<HTMLDivElement>(null);

  const width = 400;
  const height = 210;
  const pad = { top: 34, right: 18, bottom: 26, left: 40 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const n = points.length;
  const rValues = points.map((p) => p.rating);
  const rLo = Math.floor((Math.min(...rValues, startRating) - 25) / 50) * 50;
  const rHi = Math.ceil((Math.max(...rValues, startRating) + 25) / 50) * 50;

  const x = (i: number) => (n === 1 ? pad.left + innerW / 2 : pad.left + (i / (n - 1)) * innerW);
  const y = (r: number) => pad.top + ((rHi - r) / (rHi - rLo)) * innerH;

  const ticks: number[] = [];
  for (let r = rLo; r <= rHi; r += 50) ticks.push(r);

  const path = points.map((p, i) => `${x(i).toFixed(1)},${y(p.rating).toFixed(1)}`).join(" ");
  const hotIndex = hot === undefined ? -1 : points.findIndex((p) => p.matchId === hot);

  function pick(clientX: number) {
    const el = wrap.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = ((clientX - rect.left) / rect.width) * width;
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < n; i++) {
      const d = Math.abs(x(i) - px);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    onHot(points[best].matchId);
  }

  const last = points[n - 1];
  const hp = hotIndex >= 0 ? points[hotIndex] : null;
  const side =
    hotIndex < 0 ? "" : x(hotIndex) < width * 0.28 ? " l" : x(hotIndex) > width * 0.72 ? " r" : "";

  return (
    <div
      className="graph-wrap"
      ref={wrap}
      onPointerMove={(e) => pick(e.clientX)}
      onPointerDown={(e) => pick(e.clientX)}
      onPointerLeave={() => onHot(undefined)}
    >
      <svg className="graph" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Rating over time">
        {ticks.map((r) => (
          <g key={r}>
            <line className="grid" x1={pad.left} x2={width - pad.right} y1={y(r)} y2={y(r)} />
            <text className="tick" x={pad.left - 8} y={y(r) + 4} textAnchor="end">
              {r}
            </text>
          </g>
        ))}
        <line className="base-line" x1={pad.left} x2={width - pad.right} y1={y(startRating)} y2={y(startRating)} />

        {n > 1 && <polyline className="ink" points={path} />}
        {points.slice(1).map((p, i) => (
          <line
            key={i}
            className={`seg ${p.rating >= points[i].rating ? "up" : "down"}`}
            x1={x(i)}
            y1={y(points[i].rating)}
            x2={x(i + 1)}
            y2={y(p.rating)}
          />
        ))}
        {hotIndex >= 0 && (
          <line className="hl" x1={x(hotIndex)} x2={x(hotIndex)} y1={pad.top} y2={height - pad.bottom} />
        )}
        {points.map((p, i) => (
          <circle
            key={i}
            className={`pt ${p.matchId === null ? "start" : i === n - 1 ? "last" : (p.delta ?? 0) >= 0 ? "up" : "down"}`}
            cx={x(i)}
            cy={y(p.rating)}
            r={hotIndex === i ? 8 : i === n - 1 ? 6.5 : 5}
          />
        ))}

        {hotIndex !== n - 1 && (
          <g className="now" transform={`translate(${Math.min(x(n - 1), width - pad.right - 30)}, ${Math.max(y(last.rating) - 44, 4)})`}>
            <rect x={-30} y={0} width={60} height={30} rx={10} />
            <text className="val" x={0} y={15} textAnchor="middle">
              {Math.round(last.rating)}
            </text>
            <text className="cap" x={0} y={25} textAnchor="middle">
              now
            </text>
          </g>
        )}

        <text className="axis" x={pad.left} y={height - 6}>
          {points[0].date}
        </text>
        <text className="axis" x={width - pad.right} y={height - 6} textAnchor="end">
          {last.date}
        </text>
      </svg>

      {hp && (
        <div
          className={`tip${side}`}
          style={{ left: `${(x(hotIndex) / width) * 100}%`, top: `${(y(hp.rating) / height) * 100}%` }}
        >
          <div className="tdate">{hp.date}</div>
          <div className="twho">{hp.who || "Joined the ladder"}</div>
          <div className="tline">
            {hp.delta === null ? (
              <span className="d start">{startRating}</span>
            ) : (
              <>
                <span className={`d ${hp.delta >= 0 ? "up" : "down"}`}>
                  {hp.delta >= 0 ? "+" : ""}
                  {Math.round(hp.delta)}
                </span>
                → <b>{Math.round(hp.rating)}</b>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
