import Link from "next/link";
import { notFound } from "next/navigation";
import { Dock } from "@/components/dock";
import { WhatsAppRow } from "@/components/whatsapp-row";
import { PlayerHistory, type HistoryMatch } from "@/components/player-history";
import type { GraphPoint } from "@/components/rating-graph";
import { START_RATING } from "@/lib/config";
import { formatRating } from "@/lib/format";
import { leaderboard, playerPage } from "@/lib/queries";

export const dynamic = "force-dynamic";

const hexClass = ["gold", "silver", "bronze"];

const shortDate = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  month: "short",
  day: "numeric",
});

export default async function PlayerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ welcome?: string }>;
}) {
  const { id: raw } = await params;
  const { welcome } = await searchParams;
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
    { matchId: null, rating: START_RATING, delta: null, who: "", date: shortDate.format(player.createdAt) },
    ...player.history.map((h) => {
      const m = byMatch.get(h.matchId);
      const other = m ? (m.side === "a" ? m.b : m.a) : [];
      const verb = h.delta >= 0 ? "Beat" : "Lost to";
      return {
        matchId: h.matchId,
        rating: h.rating,
        delta: h.delta,
        who: other.length ? `${verb} ${other.map((p) => p.name).join(" & ")}` : verb,
        date: shortDate.format(h.at),
      };
    }),
  ];

  const matches: HistoryMatch[] = player.matches.map((m) => {
    const own = m.side === "a" ? m.a : m.b;
    const other = m.side === "a" ? m.b : m.a;
    return {
      id: m.id,
      date: shortDate.format(m.createdAt),
      deleted: m.deleted,
      won: m.won,
      doubles: m.doubles,
      delta: m.delta,
      opponents: other,
      partners: own.filter((p) => p.id !== player.id),
    };
  });

  return (
    <>
      {welcome !== undefined && (
        <div className="welcome pop-in">
          <b>You&apos;re on the board.</b> Find someone to play in the group.
          <WhatsAppRow text="Ashdown ping-pong on WhatsApp" />
        </div>
      )}
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

      <PlayerHistory points={points} matches={matches} startRating={START_RATING} />

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
