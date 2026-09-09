/**
 * Deletion state derived from the append-only log. A deletion voids a match;
 * a restore cancels a specific deletion. Nothing is ever updated, so the
 * current state of a match is decided by its latest deletion: deleted if that
 * deletion has no restore, otherwise counted.
 */
export interface DeletionEvent {
  id: number;
  matchId: number;
  createdAt: Date;
}

export interface RestoreEvent {
  id: number;
  deletionId: number;
  createdAt: Date;
}

export interface MatchState {
  deleted: boolean;
  /** The deletion currently in force, when deleted. */
  deletionId: number | null;
  deletedAt: Date | null;
}

export function effectiveDeletions(
  deletions: readonly DeletionEvent[],
  restores: readonly RestoreEvent[],
): Map<number, MatchState> {
  const restored = new Set(restores.map((r) => r.deletionId));
  const latest = new Map<number, DeletionEvent>();
  for (const d of deletions) {
    const cur = latest.get(d.matchId);
    if (
      !cur ||
      d.createdAt.getTime() > cur.createdAt.getTime() ||
      (d.createdAt.getTime() === cur.createdAt.getTime() && d.id > cur.id)
    ) {
      latest.set(d.matchId, d);
    }
  }
  const out = new Map<number, MatchState>();
  for (const [matchId, d] of latest) {
    const deleted = !restored.has(d.id);
    out.set(matchId, {
      deleted,
      deletionId: deleted ? d.id : null,
      deletedAt: deleted ? d.createdAt : null,
    });
  }
  return out;
}

/** Match ids that are currently deleted, for the rating replay. */
export function deletedMatchIds(states: Map<number, MatchState>): number[] {
  return [...states].filter(([, s]) => s.deleted).map(([id]) => id);
}
