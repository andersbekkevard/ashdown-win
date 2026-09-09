import Link from "next/link";
import type { Activity } from "@/lib/activity";

/**
 * The live indicator. One card above the board that links to the log: a
 * recording-style dot that blinks while the table is hot, the time since the
 * last match, and who beat whom. Rendered on the server per request.
 */
export function ActivityCard({ activity }: { activity: Activity }) {
  const { state, when, line } = activity;
  return (
    <Link href="/log" className={`activity slab ${state}`} aria-label={`Recent activity, ${when || "none"}. Open the log.`}>
      <span className="dot" aria-hidden="true" />
      <span className="a-body">
        <span className="a-head">
          <b>{state === "hot" ? "Live at the table" : "Recent activity"}</b>
          <span className="a-when">{when}</span>
        </span>
        <span className="a-line">{line}</span>
      </span>
      <span className="a-chev" aria-hidden="true">›</span>
    </Link>
  );
}
