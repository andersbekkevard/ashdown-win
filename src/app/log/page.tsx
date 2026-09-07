import Link from "next/link";
import { DeleteMatchButton } from "@/components/delete-match-button";
import { Dock } from "@/components/dock";
import { formatDate } from "@/lib/format";
import { matchLog, type MatchView, type Participant } from "@/lib/queries";

export const dynamic = "force-dynamic";

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

function MatchLine({ match }: { match: MatchView }) {
  const winners = match.winner === "a" ? match.a : match.b;
  const losers = match.winner === "a" ? match.b : match.a;
  return (
    <>
      <Names members={winners} /> beat <Names members={losers} />
      {match.doubles ? " (doubles)" : ""}
    </>
  );
}

export default async function LogPage() {
  const entries = await matchLog();
  return (
    <>
      <h1 className="shout">The log</h1>
      <div className="card slab pop-in">
        <h3>
          Every match <span>newest first</span>
        </h3>
        <p className="hint" style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600, margin: "0 0 8px" }}>
          Nothing is ever edited. A deletion is a new entry that voids an earlier match, and it
          stays in the log too.
        </p>
        {entries.length === 0 ? (
          <p className="empty">Nothing recorded yet.</p>
        ) : (
          entries.map((e) =>
            e.kind === "match" ? (
              <div key={`m${e.match.id}`} className="log-row">
                <div>
                  <div className={`what${e.match.deleted ? " gone" : ""}`}>
                    <MatchLine match={e.match} />
                  </div>
                  <div className="when">
                    #{e.match.id} · {formatDate(e.at)}
                  </div>
                </div>
                {e.match.deleted ? (
                  <span className="mini" style={{ color: "var(--faint)", boxShadow: "none" }}>deleted</span>
                ) : (
                  <DeleteMatchButton matchId={e.match.id} />
                )}
              </div>
            ) : (
              <div key={`d${e.id}`} className="log-row">
                <div>
                  <div className="what">
                    Deleted #{e.match.id}: <MatchLine match={e.match} />
                  </div>
                  <div className="when">deletion · {formatDate(e.at)}</div>
                </div>
              </div>
            ),
          )
        )}
      </div>
      <Dock one>
        <Link href="/" className="btn ghost">
          Back to the board
        </Link>
      </Dock>
    </>
  );
}
