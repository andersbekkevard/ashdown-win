import type { HistoryPoint } from "./rating";

/** Streaks shorter than this are not shown. */
export const STREAK_MIN = 3;

/** Consecutive wins at the end of a player's counted history. */
export function currentStreak(history: readonly HistoryPoint[]): number {
  let n = 0;
  for (let i = history.length - 1; i >= 0 && history[i].delta > 0; i--) n++;
  return n;
}
