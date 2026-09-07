/**
 * Read side. Every function loads the log and replays it; nothing here caches
 * a rating. At residence scale this is cheap (see docs/architecture.md).
 */
import { asc, ilike } from "drizzle-orm";
import { getDb } from "@/db";
import {
  deletions,
  matches,
  players,
  type DeletionRow,
  type MatchRow,
  type PlayerRow,
} from "@/db/schema";
import { START_RATING } from "./config";
import {
  compareByCreation,
  isDoubles,
  replay,
  type HistoryPoint,
  type ReplayResult,
  type Side,
} from "./rating";

export interface Log {
  players: PlayerRow[];
  matches: MatchRow[];
  deletions: DeletionRow[];
}

export async function loadLog(): Promise<Log> {
  const db = getDb();
  const [p, m, d] = await Promise.all([
    db.select().from(players).orderBy(asc(players.createdAt), asc(players.id)),
    db.select().from(matches).orderBy(asc(matches.createdAt), asc(matches.id)),
    db
      .select()
      .from(deletions)
      .orderBy(asc(deletions.createdAt), asc(deletions.id)),
  ]);
  return { players: p, matches: m, deletions: d };
}

export function replayLog(log: Log): ReplayResult {
  return replay(log.players, log.matches, log.deletions);
}

export interface LeaderboardRow {
  id: number;
  name: string;
  rating: number;
  matchesPlayed: number;
  wins: number;
}

/** Every player, including those with no matches, best rating first. */
export async function leaderboard(): Promise<LeaderboardRow[]> {
  const log = await loadLog();
  const { ratings, history } = replayLog(log);
  return log.players
    .map((p) => ({
      id: p.id,
      name: p.name,
      rating: ratings.get(p.id) ?? START_RATING,
      matchesPlayed: history.get(p.id)?.length ?? 0,
      wins: (history.get(p.id) ?? []).filter((h) => h.delta > 0).length,
    }))
    .sort((x, y) => y.rating - x.rating || x.name.localeCompare(y.name));
}

export interface PlayerHit {
  id: number;
  name: string;
}

/** Case-insensitive substring search on name. */
export async function searchPlayers(
  query: string,
  limit = 10,
): Promise<PlayerHit[]> {
  const q = query.trim();
  if (!q) return [];
  const escaped = q.replace(/[\\%_]/g, (c) => `\\${c}`);
  const rows = await getDb()
    .select({ id: players.id, name: players.name })
    .from(players)
    .where(ilike(players.name, `%${escaped}%`))
    .orderBy(asc(players.name))
    .limit(limit);
  return rows;
}

/** Exact case-insensitive lookup, used for duplicate checks. */
export async function findPlayerByName(
  name: string,
): Promise<PlayerHit | undefined> {
  const escaped = name.trim().replace(/[\\%_]/g, (c) => `\\${c}`);
  const rows = await getDb()
    .select({ id: players.id, name: players.name })
    .from(players)
    .where(ilike(players.name, escaped))
    .limit(1);
  return rows[0];
}

export interface Participant {
  id: number;
  name: string;
}

export interface MatchView {
  id: number;
  createdAt: Date;
  doubles: boolean;
  a: Participant[];
  b: Participant[];
  winner: Side;
  deleted: boolean;
  deletedAt: Date | null;
}

export interface PlayerMatch extends MatchView {
  /** The side this player was on. */
  side: Side;
  won: boolean;
  /** Rating change for this player, null when the match is deleted. */
  delta: number | null;
  /** Rating after this match, null when the match is deleted. */
  ratingAfter: number | null;
}

export interface PlayerPage {
  id: number;
  name: string;
  createdAt: Date;
  rating: number;
  /** Rating after each counted match, in log order. */
  history: HistoryPoint[];
  /** Every match involving this player, newest first, deleted ones flagged. */
  matches: PlayerMatch[];
}

function nameOf(byId: Map<number, PlayerRow>, id: number): Participant {
  const p = byId.get(id);
  return { id, name: p?.name ?? `#${id}` };
}

function toMatchView(
  m: MatchRow,
  byId: Map<number, PlayerRow>,
  deletedAt: Map<number, Date>,
): MatchView {
  const a = [m.a1, ...(m.a2 === null ? [] : [m.a2])].map((id) =>
    nameOf(byId, id),
  );
  const b = [m.b1, ...(m.b2 === null ? [] : [m.b2])].map((id) =>
    nameOf(byId, id),
  );
  const del = deletedAt.get(m.id) ?? null;
  return {
    id: m.id,
    createdAt: m.createdAt,
    doubles: isDoubles(m),
    a,
    b,
    winner: m.winner,
    deleted: del !== null,
    deletedAt: del,
  };
}

export async function playerPage(id: number): Promise<PlayerPage | null> {
  const log = await loadLog();
  const player = log.players.find((p) => p.id === id);
  if (!player) return null;

  const { ratings, history } = replayLog(log);
  const byId = new Map(log.players.map((p) => [p.id, p]));
  const deletedAt = new Map(log.deletions.map((d) => [d.matchId, d.createdAt]));
  const own = history.get(id) ?? [];
  const byMatch = new Map(own.map((h) => [h.matchId, h]));

  const involved = log.matches
    .filter((m) => [m.a1, m.a2, m.b1, m.b2].includes(id))
    .sort((x, y) => compareByCreation(y, x))
    .map((m): PlayerMatch => {
      const view = toMatchView(m, byId, deletedAt);
      const side: Side = m.a1 === id || m.a2 === id ? "a" : "b";
      const h = byMatch.get(m.id);
      return {
        ...view,
        side,
        won: m.winner === side,
        delta: h?.delta ?? null,
        ratingAfter: h?.rating ?? null,
      };
    });

  return {
    id: player.id,
    name: player.name,
    createdAt: player.createdAt,
    rating: ratings.get(id) ?? START_RATING,
    history: own,
    matches: involved,
  };
}

export type LogEntry =
  | { kind: "match"; at: Date; match: MatchView }
  | { kind: "deletion"; at: Date; id: number; match: MatchView };

/** All matches and deletions as one list, newest first. */
export async function matchLog(): Promise<LogEntry[]> {
  const log = await loadLog();
  const byId = new Map(log.players.map((p) => [p.id, p]));
  const deletedAt = new Map(log.deletions.map((d) => [d.matchId, d.createdAt]));
  const views = new Map(
    log.matches.map((m) => [m.id, toMatchView(m, byId, deletedAt)]),
  );

  const entries: LogEntry[] = [];
  for (const m of log.matches) {
    entries.push({ kind: "match", at: m.createdAt, match: views.get(m.id)! });
  }
  for (const d of log.deletions) {
    const match = views.get(d.matchId);
    if (match) entries.push({ kind: "deletion", at: d.createdAt, id: d.id, match });
  }
  return entries.sort(
    (x, y) =>
      y.at.getTime() - x.at.getTime() ||
      (y.kind === "match" ? y.match.id : y.id) -
        (x.kind === "match" ? x.match.id : x.id),
  );
}
