/**
 * The rating engine. Pure and framework-free: it takes the log as plain data
 * and returns ratings and per-player histories. It implements
 * docs/algorithm.md exactly; read that before changing anything here.
 */
import { K_DOUBLES, K_SINGLES, START_RATING } from "./config";

export type Side = "a" | "b";

export interface PlayerInput {
  id: number;
}

export interface MatchInput {
  id: number;
  createdAt: Date;
  a1: number;
  a2: number | null;
  b1: number;
  b2: number | null;
  winner: Side;
}

export interface DeletionInput {
  matchId: number;
}

/** One step of a player's rating history: the state after a given match. */
export interface HistoryPoint {
  matchId: number;
  at: Date;
  /** Rating change this match produced for the player. */
  delta: number;
  /** Rating after the match was applied. */
  rating: number;
}

export interface ReplayResult {
  /** Current rating for every player passed in, plus any id seen in a match. */
  ratings: Map<number, number>;
  /** Per player, every non-deleted match they played, in log order. */
  history: Map<number, HistoryPoint[]>;
}

/** Expected score of a player rated `own` against one rated `opponent`. */
export function expectedScore(own: number, opponent: number): number {
  return 1 / (1 + Math.pow(10, (opponent - own) / 400));
}

/** Log order: by creation time, then by id as a tie-break. */
export function compareByCreation(
  x: { id: number; createdAt: Date },
  y: { id: number; createdAt: Date },
): number {
  const dt = x.createdAt.getTime() - y.createdAt.getTime();
  return dt !== 0 ? dt : x.id - y.id;
}

export function isDoubles(match: Pick<MatchInput, "a2" | "b2">): boolean {
  return match.a2 !== null && match.b2 !== null;
}

/**
 * Replay the log from the start with the current constants.
 *
 * Every player starts at START_RATING. Matches are applied in creation order,
 * skipping any that have a deletion. Singles use standard Elo at K_SINGLES.
 * Doubles treat each team as a virtual player rated at the mean of its two
 * members; both members receive the same delta at K_DOUBLES.
 */
export function replay(
  players: readonly PlayerInput[],
  matches: readonly MatchInput[],
  deletions: readonly DeletionInput[],
): ReplayResult {
  const ratings = new Map<number, number>();
  const history = new Map<number, HistoryPoint[]>();

  const ensure = (id: number) => {
    if (!ratings.has(id)) {
      ratings.set(id, START_RATING);
      history.set(id, []);
    }
  };
  for (const p of players) ensure(p.id);

  const deleted = new Set(deletions.map((d) => d.matchId));
  const ordered = [...matches].sort(compareByCreation);

  for (const m of ordered) {
    if (deleted.has(m.id)) continue;

    const teamA = m.a2 === null ? [m.a1] : [m.a1, m.a2];
    const teamB = m.b2 === null ? [m.b1] : [m.b1, m.b2];
    for (const id of [...teamA, ...teamB]) ensure(id);

    const mean = (team: number[]) =>
      team.reduce((sum, id) => sum + (ratings.get(id) as number), 0) /
      team.length;

    const k = isDoubles(m) ? K_DOUBLES : K_SINGLES;
    const expectedA = expectedScore(mean(teamA), mean(teamB));
    const scoreA = m.winner === "a" ? 1 : 0;
    const deltaA = k * (scoreA - expectedA);
    // E_b = 1 - E_a and S_b = 1 - S_a, so the B delta is exactly -deltaA.
    const deltaB = -deltaA;

    const apply = (team: number[], delta: number) => {
      for (const id of team) {
        const rating = (ratings.get(id) as number) + delta;
        ratings.set(id, rating);
        (history.get(id) as HistoryPoint[]).push({
          matchId: m.id,
          at: m.createdAt,
          delta,
          rating,
        });
      }
    };
    apply(teamA, deltaA);
    apply(teamB, deltaB);
  }

  return { ratings, history };
}
