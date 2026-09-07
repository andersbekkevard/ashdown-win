import Link from "next/link";
import { DeleteMatchButton } from "@/components/delete-match-button";
import { formatDate } from "@/lib/format";
import { matchLog, type MatchView, type Participant } from "@/lib/queries";

export const dynamic = "force-dynamic";

function Names({ members }: { members: Participant[] }) {
  return (
    <>
      {members.map((m, i) => (
        <span key={m.id}>
          {i > 0 && " & "}
          <Link href={`/players/${m.id}`} className="underline">
            {m.name}
          </Link>
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
    <div>
      <h1 className="mb-2 text-lg font-semibold">Log</h1>
      <p className="mb-4 text-sm text-gray-600">
        Every match and every deletion, newest first. Nothing is ever edited;
        a deletion is a new entry that voids an earlier match.
      </p>
      {entries.length === 0 ? (
        <p>Nothing recorded yet.</p>
      ) : (
        <ul className="flex flex-col">
          {entries.map((e) =>
            e.kind === "match" ? (
              <li
                key={`m${e.match.id}`}
                className={`flex flex-wrap items-baseline gap-x-3 border-b py-2 text-sm ${e.match.deleted ? "text-gray-400" : ""}`}
              >
                <span className="whitespace-nowrap tabular-nums">
                  {formatDate(e.at)}
                </span>
                <span className="text-gray-500">#{e.match.id}</span>
                <span className={e.match.deleted ? "line-through" : ""}>
                  <MatchLine match={e.match} />
                </span>
                {e.match.deleted ? (
                  <span>(deleted)</span>
                ) : (
                  <DeleteMatchButton matchId={e.match.id} />
                )}
              </li>
            ) : (
              <li
                key={`d${e.id}`}
                className="flex flex-wrap items-baseline gap-x-3 border-b py-2 text-sm"
              >
                <span className="whitespace-nowrap tabular-nums">
                  {formatDate(e.at)}
                </span>
                <span className="text-gray-500">deletion</span>
                <span>
                  Deleted match #{e.match.id}: <MatchLine match={e.match} />
                </span>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
}
