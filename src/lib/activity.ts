import type { LogEntry, Participant } from "./queries";

const HOT_MS = 10 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export type ActivityState = "hot" | "warm" | "quiet";

export interface Activity {
  state: ActivityState;
  /** Human time since the latest entry, empty when there is none. */
  when: string;
  /** One line about the latest entry. */
  line: string;
}

function ago(ms: number): string {
  if (ms < 2 * 60 * 1000) return "just now";
  if (ms < 60 * 60 * 1000) return `${Math.max(1, Math.round(ms / 60000))}m ago`;
  if (ms < DAY_MS) return `${Math.round(ms / 3600000)}h ago`;
  const d = Math.round(ms / DAY_MS);
  return d === 1 ? "yesterday" : `${d} days ago`;
}

const names = (m: Participant[]) => m.map((p) => p.name).join(" & ");

/** Summarise the latest log entry for the activity card. Reads the clock. */
export function activitySummary(latest: LogEntry | undefined, now = Date.now()): Activity {
  if (!latest) return { state: "quiet", when: "", line: "No matches yet. Be the first." };
  const since = now - latest.at.getTime();
  const state: ActivityState = since < HOT_MS ? "hot" : since < DAY_MS ? "warm" : "quiet";
  const m = latest.match;
  let line: string;
  if (latest.kind === "deletion") line = `Match #${m.id} was deleted`;
  else if (latest.kind === "restore") line = `Match #${m.id} was restored`;
  else {
    const winners = m.winner === "a" ? m.a : m.b;
    const losers = m.winner === "a" ? m.b : m.a;
    line = `${names(winners)} beat ${names(losers)}`;
  }
  return { state, when: ago(since), line };
}
