import Link from "next/link";
import { Crown } from "@/components/crown";
import { Dock } from "@/components/dock";
import { formatRating } from "@/lib/format";
import { leaderboard } from "@/lib/queries";

export const dynamic = "force-dynamic";

const hexClass = ["gold", "silver", "bronze"];

export default async function HomePage() {
  const rows = await leaderboard();
  return (
    <>
      <p className="lead">
        The table tennis ladder for Ashdown House. Add your name, record who won, climb.{" "}
        <Link href="/algorithm" className="howlink">
          How it works ›
        </Link>
      </p>
      <div className="board slab pop-in">
        <div className="board-head">
          <h1 className="shout">Leaderboard</h1>
          <div className="count">
            {rows.length}
            <small>players</small>
          </div>
        </div>
        {rows.length === 0 ? (
          <p className="empty">Nobody on the board yet. Create the first player.</p>
        ) : (
          rows.map((r, i) => (
            <Link
              key={r.id}
              href={`/players/${r.id}`}
              className={`row${i === 0 ? " top1" : ""}${r.matchesPlayed === 0 ? " fresh" : ""}`}
            >
              <div className={`hex ${hexClass[i] ?? ""}`}>{i + 1}</div>
              <div className="who">
                <div className="name">
                  {i === 0 && <Crown />}
                  <span>{r.name}</span>
                </div>
                <div className="rec">
                  {r.matchesPlayed === 0 ? (
                    "New. No matches yet"
                  ) : (
                    <>
                      <b>{r.wins}W</b> · {r.matchesPlayed - r.wins}L
                    </>
                  )}
                </div>
              </div>
              <div className="rating">{formatRating(r.rating)}</div>
            </Link>
          ))
        )}
      </div>
      <Dock>
        <Link href="/players/new" className="btn lilac">
          Create player
        </Link>
        <Link href="/matches/new" className="btn">
          Record match
        </Link>
      </Dock>
    </>
  );
}
