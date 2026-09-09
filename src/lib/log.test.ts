import { describe, expect, it } from "vitest";
import { deletedMatchIds, effectiveDeletions } from "./log";

const t = (s: number) => new Date(1_700_000_000_000 + s * 1000);

describe("effectiveDeletions", () => {
  it("a deletion voids the match", () => {
    const s = effectiveDeletions([{ id: 1, matchId: 7, createdAt: t(1) }], []);
    expect(s.get(7)).toEqual({ deleted: true, deletionId: 1, deletedAt: t(1) });
    expect(deletedMatchIds(s)).toEqual([7]);
  });
  it("a restore cancels the deletion", () => {
    const s = effectiveDeletions(
      [{ id: 1, matchId: 7, createdAt: t(1) }],
      [{ id: 1, deletionId: 1, createdAt: t(2) }],
    );
    expect(s.get(7)?.deleted).toBe(false);
    expect(deletedMatchIds(s)).toEqual([]);
  });
  it("delete, restore, delete again ends deleted", () => {
    const s = effectiveDeletions(
      [
        { id: 1, matchId: 7, createdAt: t(1) },
        { id: 2, matchId: 7, createdAt: t(3) },
      ],
      [{ id: 1, deletionId: 1, createdAt: t(2) }],
    );
    expect(s.get(7)).toEqual({ deleted: true, deletionId: 2, deletedAt: t(3) });
  });
  it("uses id as the tie-break for simultaneous deletions", () => {
    const s = effectiveDeletions(
      [
        { id: 2, matchId: 7, createdAt: t(1) },
        { id: 1, matchId: 7, createdAt: t(1) },
      ],
      [{ id: 1, deletionId: 2, createdAt: t(2) }],
    );
    expect(s.get(7)?.deleted).toBe(false);
  });
  it("untouched matches have no state", () => {
    expect(effectiveDeletions([], []).get(1)).toBeUndefined();
  });
});
