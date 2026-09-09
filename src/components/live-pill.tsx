import { desc } from "drizzle-orm";
import Link from "next/link";
import { getDb } from "@/db";
import { matches } from "@/db/schema";
import { liveness } from "@/lib/activity";

/**
 * The live indicator in the top bar: a dot and the time since the last
 * match, cooling through the day. Links to the log. Renders the cold state
 * when the database is unavailable, including at build time.
 */
export async function LivePill() {
  let last: Date | null = null;
  try {
    const [row] = await getDb()
      .select({ at: matches.createdAt })
      .from(matches)
      .orderBy(desc(matches.createdAt), desc(matches.id))
      .limit(1);
    last = row?.at ?? null;
  } catch {
    last = null;
  }
  const l = liveness(last);
  const style = { "--fb": l.border.toFixed(3), "--fd": l.dot.toFixed(3) } as React.CSSProperties;
  return (
    <Link href="/log" className={`chip ind ${l.motion}`} style={style} aria-label={l.long ? `Last match ${l.long}. Open the log.` : "No matches yet. Open the log."}>
      <span className="d" aria-hidden="true" />
      {l.short || "log"}
    </Link>
  );
}
