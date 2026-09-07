import Link from "next/link";
import { notFound } from "next/navigation";
import { RatingGraph } from "@/components/rating-graph";
import { formatDate, formatDelta, formatRating } from "@/lib/format";
import { playerPage, type Participant } from "@/lib/queries";

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

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: raw } = await params;
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const player = await playerPage(id);
  if (!player) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">{player.name}</h1>
        <p className="text-3xl tabular-nums">{formatRating(player.rating)}</p>
        <p className="text-sm text-gray-600">
          {player.history.length} counted{" "}
          {player.history.length === 1 ? "match" : "matches"}. Player since{" "}
          {formatDate(player.createdAt)}.
        </p>
      </div>

      <section>
        <h2 className="mb-2 font-semibold">Rating over time</h2>
        <RatingGraph createdAt={player.createdAt} history={player.history} />
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Matches</h2>
        {player.matches.length === 0 ? (
          <p>
            No matches yet.{" "}
            <Link href="/matches/new" className="underline">
              Record one
            </Link>
            .
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-1 pr-2">When</th>
                <th className="py-1 pr-2">With</th>
                <th className="py-1 pr-2">Against</th>
                <th className="py-1 pr-2">Result</th>
                <th className="py-1 text-right">Change</th>
              </tr>
            </thead>
            <tbody>
              {player.matches.map((m) => {
                const own = m.side === "a" ? m.a : m.b;
                const other = m.side === "a" ? m.b : m.a;
                const partners = own.filter((p) => p.id !== player.id);
                return (
                  <tr
                    key={m.id}
                    className={`border-b ${m.deleted ? "line-through text-gray-400" : ""}`}
                  >
                    <td className="py-1 pr-2 whitespace-nowrap">
                      {formatDate(m.createdAt)}
                    </td>
                    <td className="py-1 pr-2">
                      {partners.length ? <Names members={partners} /> : "—"}
                    </td>
                    <td className="py-1 pr-2">
                      <Names members={other} />
                    </td>
                    <td className="py-1 pr-2">
                      {m.deleted ? "deleted" : m.won ? "won" : "lost"}
                    </td>
                    <td className="py-1 text-right tabular-nums">
                      {m.delta === null ? "—" : formatDelta(m.delta)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
