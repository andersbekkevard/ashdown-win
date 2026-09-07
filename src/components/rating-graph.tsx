import { START_RATING } from "@/lib/config";
import type { HistoryPoint } from "@/lib/rating";

/**
 * Rating over time as a hand-written SVG polyline. The first point is the
 * player's creation at START_RATING; every later point is the rating after a
 * counted match.
 */
export function RatingGraph({
  createdAt,
  history,
}: {
  createdAt: Date;
  history: HistoryPoint[];
}) {
  const width = 600;
  const height = 200;
  const pad = { top: 10, right: 10, bottom: 24, left: 44 };

  const points = [
    { t: createdAt.getTime(), r: START_RATING },
    ...history.map((h) => ({ t: h.at.getTime(), r: h.rating })),
  ];

  const tMin = points[0].t;
  const tMax = Math.max(points[points.length - 1].t, tMin + 1);
  const rValues = points.map((p) => p.r);
  const rLo = Math.floor((Math.min(...rValues) - 20) / 50) * 50;
  const rHi = Math.ceil((Math.max(...rValues) + 20) / 50) * 50;

  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const x = (t: number) => pad.left + ((t - tMin) / (tMax - tMin)) * innerW;
  const y = (r: number) => pad.top + ((rHi - r) / (rHi - rLo)) * innerH;

  const ticks: number[] = [];
  for (let r = rLo; r <= rHi; r += 50) ticks.push(r);

  const path = points.map((p) => `${x(p.t).toFixed(1)},${y(p.r).toFixed(1)}`);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Rating over time"
      className="w-full max-w-xl border"
    >
      {ticks.map((r) => (
        <g key={r}>
          <line
            x1={pad.left}
            x2={width - pad.right}
            y1={y(r)}
            y2={y(r)}
            stroke="#ddd"
          />
          <text
            x={pad.left - 6}
            y={y(r) + 4}
            fontSize="11"
            textAnchor="end"
            fill="#666"
          >
            {r}
          </text>
        </g>
      ))}
      <line
        x1={pad.left}
        x2={width - pad.right}
        y1={y(START_RATING)}
        y2={y(START_RATING)}
        stroke="#999"
        strokeDasharray="4 4"
      />
      <polyline
        points={path.join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      {points.map((p, i) => (
        <circle key={i} cx={x(p.t)} cy={y(p.r)} r="3" fill="currentColor" />
      ))}
      <text
        x={pad.left}
        y={height - 6}
        fontSize="11"
        fill="#666"
      >
        {new Date(tMin).toLocaleDateString("en-US", { timeZone: "America/New_York" })}
      </text>
      <text
        x={width - pad.right}
        y={height - 6}
        fontSize="11"
        textAnchor="end"
        fill="#666"
      >
        {new Date(tMax).toLocaleDateString("en-US", { timeZone: "America/New_York" })}
      </text>
    </svg>
  );
}
