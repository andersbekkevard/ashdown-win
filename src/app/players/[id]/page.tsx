import Link from "next/link";
import { notFound } from "next/navigation";
import { Dock } from "@/components/dock";
import { RatingGraph, type GraphPoint } from "@/components/rating-graph";
import { START_RATING } from "@/lib/config";
import { formatDelta, formatRating } from "@/lib/format";
import { leaderboard, playerPage, type Participant } from "@/lib/queries";

export const dynamic = "force-dynamic";

const hexClass = ["gold", "silver", "bronze"];

const shortDate = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  month: "short",
  day: "numeric",
});

function Names({ members }: { members: Participant[] }) {
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

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: raw } = await params;
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const [player, board] = await Promise.all([playerPage(id), leaderboard()]);
  if (!player) notFound();
  const rank = board.findIndex((r) => r.id === id) + 1;

  const counted = player.matches.filter((m) => !m.deleted);
  const wins = counted.filter((m) => m.won).length;
  const losses = counted.length - wins;

  const byMatch = new Map(player.matches.map((m) => [m.id, m]));
  const points: GraphPoint[] = [
    {
      t: player.createdAt.getTime(),
      rating: START_RATING,
      delta: null,
      who: "",
      date: shortDate.format(player.createdAt),
    },
    ...player.history.map((h) => {
      const m = byMatch.get(h.matchId);
      const other = m ? (m.side === "a" ? m.b : m.a) : [];
      const verb = h.delta >= 0 ? "Beat" : "Lost to";
      return {
        t: h.at.getTime(),
        rating: h.rating,
        delta: h.delta,
        who: other.length ? `${verb} ${other.map((p) => p.name).join(" & ")}` : verb,
        date: shortDate.format(h.at),
      };
    }),
  ];

  return (
    <>
      <div className="hero-card slab pop-in">
        <div className={`hex ${hexClass[rank - 1] ?? ""}`}>{rank || "–"}</div>
        <div>
          <h2 className="shout">{player.name}</h2>
          <div className="num">
            {formatRating(player.rating)}
            <small>rating</small>
          </div>
          <div className="rec">
            <span className="w">{wins} W</span>
            <span className="l">{losses} L</span>
            <span>#{rank} of {board.length}</span>
          </div>
        </div>
      </div>

      <div className="card graph-card slab">
        <h3>
          Rating <span>{counted.length} {counted.length === 1 ? "match" : "matches"}</span>
        </h3>
        <RatingGraph points={points} startRating={START_RATING} />
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
        {player.matches.length === 0 ? (
          <p className="empty">No matches yet. Go play one.</p>
        ) : (
          player.matches.map((m) => {
            const own = m.side === "a" ? m.a : m.b;
            const other = m.side === "a" ? m.b : m.a;
            const partners = own.filter((p) => p.id !== player.id);
            return (
              <div key={m.id} className={`match${m.deleted ? " gone" : ""}`}>
                <div>
                  <div className="opp">
                    {m.deleted ? "Deleted: " : m.won ? "Beat " : "Lost to "}
                    <Names members={other} />
                  </div>
                  <div className="meta">
                    <span className={`type${m.doubles ? " doubles" : ""}${m.deleted ? " deleted" : ""}`}>
                      {m.deleted ? "deleted" : m.doubles ? "doubles" : "singles"}
                    </span>
                    {partners.length > 0 && (
                      <span>
                        with <Names members={partners} />
                      </span>
                    )}
                    <span>{shortDate.format(m.createdAt)}</span>
                  </div>
                </div>
                <div className={`delta ${m.delta === null ? "none" : m.delta >= 0 ? "up" : "down"}`}>
                  {m.delta === null ? "–" : formatDelta(m.delta)}
                </div>
              </div>
            );
          })
        )}
      </div>

      <Dock>
        <Link href="/" className="btn ghost">
          Board
        </Link>
        <Link href="/matches/new" className="btn">
          Record match
        </Link>
      </Dock>
    </>
  );
}
