import Link from "next/link";
import { Dock } from "@/components/dock";
import { MatchLogActions } from "@/components/match-log-actions";
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

function Device({ label }: { label: string | null }) {
  if (!label) return null;
  return <span className="device" title="Anonymous label of the phone that did this">phone {label.slice(0, 4)}</span>;
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
          You can delete anything and undo anything. The log shows both, so everyone can see
          who did what.
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
                    #{e.match.id} · {formatDate(e.at)} <Device label={e.match.device} />
                  </div>
                </div>
                <MatchLogActions matchId={e.match.id} deleted={e.match.deleted} />
              </div>
            ) : (
              <div key={`${e.kind[0]}${e.id}`} className="log-row">
                <div>
                  <div className="what">
                    {e.kind === "deletion" ? "Deleted" : "Restored"} #{e.match.id}: <MatchLine match={e.match} />
                  </div>
                  <div className="when">
                    {e.kind} · {formatDate(e.at)} <Device label={e.device} />
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
