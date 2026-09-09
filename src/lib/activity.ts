/**
 * Liveness of the table from the time of the latest match. One function so
 * the indicator's colour, motion, and label agree everywhere.
 */
export type Motion = "hot" | "warm" | "cool" | "still" | "cold";

export interface Liveness {
  motion: Motion;
  /** Border and title redness, 0 to 1. Cools fast: 3 h reads like a quarter. */
  border: number;
  /** Dot redness, 0 to 1. Cools slower than the border. */
  dot: number;
  /** Short label such as "4m", "3h", "1d". Empty when there is no match. */
  short: string;
  /** Longer label such as "4m ago", "yesterday". */
  long: string;
}

const H = 60 * 60 * 1000;

export function liveness(lastMatchAt: Date | null, now = Date.now()): Liveness {
  if (!lastMatchAt) return { motion: "cold", border: 0, dot: 0, short: "", long: "" };
  const hours = Math.max(0, (now - lastMatchAt.getTime()) / H);
  const base = Math.max(0, 1 - hours / 24);
  const motion: Motion =
    hours <= 0.5 ? "hot" : hours <= 1 ? "warm" : hours <= 6 ? "cool" : hours < 24 ? "still" : "cold";
  const mins = Math.round(hours * 60);
  let short: string;
  let long: string;
  if (mins < 2) {
    short = "just now";
    long = "just now";
  } else if (hours < 1) {
    short = `${mins}m ago`;
    long = short;
  } else if (hours < 24) {
    short = `${Math.round(hours)}h ago`;
    long = short;
  } else {
    const d = Math.round(hours / 24);
    short = `${d}d ago`;
    long = d === 1 ? "yesterday" : `${d} days ago`;
  }
  return { motion, border: Math.pow(base, 6.5), dot: Math.pow(base, 3), short, long };
}
