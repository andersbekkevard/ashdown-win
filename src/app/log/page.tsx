import Link from "next/link";
import { Dock } from "@/components/dock";
import { MatchLogActions } from "@/components/match-log-actions";
import { liveness } from "@/lib/activity";
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
  // Only a match carries the liveness; a deletion or restore is bookkeeping.
  const latestIndex = entries.findIndex((e) => e.kind === "match");
  const live = latestIndex >= 0 ? liveness(entries[latestIndex].at) : null;
  const latestClass = (i: number) => (i === latestIndex && live ? ` latest ${live.motion}` : "");
  const latestStyle = (i: number) =>
    i === latestIndex && live ? ({ "--fb": live.border.toFixed(3), "--fd": live.dot.toFixed(3) } as React.CSSProperties) : undefined;
  return (
    <>
      <h1 className="shout">The log</h1>
      <div className="card slab pop-in">
        <h3>
          Every match <span>newest first</span>
        </h3>
        <p className="hint" style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600, margin: "0 0 8px" }}>
          You can delete anything and undo anything. The log shows both, so everyone can see
          who did what.
        </p>
        {entries.length === 0 ? (
          <p className="empty">Nothing recorded yet.</p>
        ) : (
          entries.map((e, i) =>
            e.kind === "match" ? (
              <div key={`m${e.match.id}`} className={`log-row${latestClass(i)}`} style={latestStyle(i)}>
                <div>
                  <div className={`what${e.match.deleted ? " gone" : ""}`}>
                    {i === latestIndex && <span className="d" aria-hidden="true" />}
                    <span><MatchLine match={e.match} /></span>
                  </div>
                  <div className="when">
                    #{e.match.id} · {formatDate(e.at)}
                  </div>
                </div>
                <MatchLogActions matchId={e.match.id} deleted={e.match.deleted} />
              </div>
            ) : (
              <div key={`${e.kind[0]}${e.id}`} className={`log-row${latestClass(i)}`} style={latestStyle(i)}>
                <div>
                  <div className="what">
                    <span>{e.kind === "deletion" ? "Deleted" : "Restored"} #{e.match.id}: <MatchLine match={e.match} /></span>
                  </div>
                  <div className="when">
                    {e.kind} · {formatDate(e.at)}
                  </div>
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
