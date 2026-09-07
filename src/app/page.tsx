import Link from "next/link";
import { formatRating } from "@/lib/format";
import { leaderboard } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const rows = await leaderboard();
  return (
    <div>
      <div className="mb-6 flex gap-3">
        <Link
          href="/players/new"
          className="rounded border px-3 py-2 underline"
        >
          Create player
        </Link>
        <Link
          href="/matches/new"
          className="rounded border px-3 py-2 underline"
        >
          Record match
        </Link>
      </div>

      <h1 className="mb-2 text-lg font-semibold">Leaderboard</h1>
      {rows.length === 0 ? (
        <p>No players yet. Create the first one.</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-1 pr-2">#</th>
              <th className="py-1 pr-2">Player</th>
              <th className="py-1 pr-2 text-right">Rating</th>
              <th className="py-1 text-right">Matches</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} className="border-b">
                <td className="py-1 pr-2">{i + 1}</td>
                <td className="py-1 pr-2">
                  <Link href={`/players/${r.id}`} className="underline">
                    {r.name}
                  </Link>
                </td>
                <td className="py-1 pr-2 text-right tabular-nums">
                  {formatRating(r.rating)}
                </td>
                <td className="py-1 text-right tabular-nums">
                  {r.matchesPlayed}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
