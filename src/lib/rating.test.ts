import { describe, expect, it } from "vitest";
import { K_DOUBLES, K_SINGLES, START_RATING } from "./config";
import { expectedScore, replay, type MatchInput } from "./rating";

const t = (seconds: number) => new Date(Date.UTC(2026, 8, 7, 0, 0, seconds));

const players = [1, 2, 3, 4].map((id) => ({ id }));

function singles(
  id: number,
  a: number,
  b: number,
  winner: "a" | "b",
  at = t(id),
): MatchInput {
  return { id, createdAt: at, a1: a, a2: null, b1: b, b2: null, winner };
}

function doubles(
  id: number,
  a: [number, number],
  b: [number, number],
  winner: "a" | "b",
  at = t(id),
): MatchInput {
  return {
    id,
    createdAt: at,
    a1: a[0],
    a2: a[1],
    b1: b[0],
    b2: b[1],
    winner,
  };
}

describe("expectedScore", () => {
  it("is one half between equals", () => {
    expect(expectedScore(1000, 1000)).toBe(0.5);
  });

  it("matches the known values at 400 and 200 points", () => {
    // 1 / (1 + 10^1) = 1/11
    expect(expectedScore(1000, 1400)).toBeCloseTo(1 / 11, 12);
    expect(expectedScore(1400, 1000)).toBeCloseTo(10 / 11, 12);
    // 1 / (1 + 10^0.5)
    expect(expectedScore(1000, 1200)).toBeCloseTo(1 / (1 + Math.sqrt(10)), 12);
  });

  it("sums to one for the two sides", () => {
    expect(expectedScore(1234, 987) + expectedScore(987, 1234)).toBeCloseTo(
      1,
      12,
    );
  });
});

describe("replay", () => {
  it("starts everyone at START_RATING with an empty history", () => {
    const { ratings, history } = replay(players, [], []);
    for (const p of players) {
      expect(ratings.get(p.id)).toBe(START_RATING);
      expect(history.get(p.id)).toEqual([]);
    }
  });

  it("moves two equal singles players by K_SINGLES / 2 each way", () => {
    const { ratings, history } = replay(players, [singles(1, 1, 2, "a")], []);
    expect(ratings.get(1)).toBe(START_RATING + K_SINGLES / 2);
    expect(ratings.get(2)).toBe(START_RATING - K_SINGLES / 2);
    expect(history.get(1)).toEqual([
      { matchId: 1, at: t(1), delta: 16, rating: 1016 },
    ]);
    expect(history.get(2)).toEqual([
      { matchId: 1, at: t(1), delta: -16, rating: 984 },
    ]);
    expect(ratings.get(3)).toBe(START_RATING);
  });

  it("uses K_SINGLES * (S - E) for an unequal singles match", () => {
    // Player 1 wins twice against 2, then loses to 3 (who is at 1000).
    const { ratings } = replay(
      players,
      [singles(1, 1, 2, "a"), singles(2, 1, 2, "a"), singles(3, 1, 3, "b")],
      [],
    );
    const r1 = START_RATING + K_SINGLES / 2;
    const r2 = START_RATING - K_SINGLES / 2;
    const e1 = expectedScore(r1, r2);
    const r1b = r1 + K_SINGLES * (1 - e1);
    const e1c = expectedScore(r1b, START_RATING);
    const r1c = r1b + K_SINGLES * (0 - e1c);
    expect(ratings.get(1)).toBeCloseTo(r1c, 12);
    expect(ratings.get(3)).toBeCloseTo(
      START_RATING + K_SINGLES * (1 - expectedScore(START_RATING, r1b)),
      12,
    );
  });

  it("gives both doubles partners the same delta of K_DOUBLES * (S - E_team)", () => {
    // Make the teams unequal first: 1 beats 3 in singles.
    const matches = [singles(1, 1, 3, "a"), doubles(2, [1, 2], [3, 4], "b")];
    const { ratings, history } = replay(players, matches, []);

    const teamA = (START_RATING + 16 + START_RATING) / 2;
    const teamB = (START_RATING - 16 + START_RATING) / 2;
    const eA = expectedScore(teamA, teamB);
    const deltaA = K_DOUBLES * (0 - eA);
    const deltaB = K_DOUBLES * (1 - (1 - eA));

    expect(history.get(1)?.[1].delta).toBeCloseTo(deltaA, 12);
    expect(history.get(2)?.[0].delta).toBeCloseTo(deltaA, 12);
    expect(history.get(3)?.[1].delta).toBeCloseTo(deltaB, 12);
    expect(history.get(4)?.[0].delta).toBeCloseTo(deltaB, 12);
    expect(ratings.get(2)).toBeCloseTo(START_RATING + deltaA, 12);
    expect(ratings.get(4)).toBeCloseTo(START_RATING + deltaB, 12);
  });

  it("uses exactly K_DOUBLES / 2 for equal doubles teams", () => {
    const { ratings } = replay(
      players,
      [doubles(1, [1, 2], [3, 4], "a")],
      [],
    );
    expect(ratings.get(1)).toBe(START_RATING + K_DOUBLES / 2);
    expect(ratings.get(2)).toBe(START_RATING + K_DOUBLES / 2);
    expect(ratings.get(3)).toBe(START_RATING - K_DOUBLES / 2);
    expect(ratings.get(4)).toBe(START_RATING - K_DOUBLES / 2);
  });

  it("ignores a deleted match entirely", () => {
    const matches = [singles(1, 1, 2, "a"), singles(2, 1, 2, "a")];
    const withDeletion = replay(players, matches, [{ matchId: 1 }]);
    const withoutMatch = replay(players, [matches[1]], []);
    expect(withDeletion.ratings).toEqual(withoutMatch.ratings);
    expect(withDeletion.history).toEqual(withoutMatch.history);
    expect(withDeletion.history.get(1)?.map((h) => h.matchId)).toEqual([2]);
  });

  it("applies matches in created_at order regardless of input order or id", () => {
    // Match 2 happened first (earlier timestamp) although it has a higher id
    // and is listed first. Player 1 loses first, then wins.
    const later = singles(1, 1, 2, "a", t(20));
    const earlier = singles(2, 1, 2, "b", t(10));
    const { history } = replay(players, [later, earlier], []);
    expect(history.get(1)?.map((h) => h.matchId)).toEqual([2, 1]);

    const inOrder = replay(players, [earlier, later], []);
    expect(inOrder.history).toEqual(history);

    // And the values reflect that order: a loss at 1000 then a win from 984.
    const afterLoss = START_RATING - K_SINGLES / 2;
    const afterWin =
      afterLoss +
      K_SINGLES * (1 - expectedScore(afterLoss, START_RATING + K_SINGLES / 2));
    expect(history.get(1)?.[1].rating).toBeCloseTo(afterWin, 12);
  });

  it("breaks created_at ties by id", () => {
    const same = t(5);
    const { history } = replay(
      players,
      [singles(2, 1, 2, "a", same), singles(1, 1, 2, "b", same)],
      [],
    );
    expect(history.get(1)?.map((h) => h.matchId)).toEqual([1, 2]);
  });

  it("conserves total rating across a mixed log", () => {
    const matches: MatchInput[] = [
      singles(1, 1, 2, "a"),
      doubles(2, [1, 2], [3, 4], "b"),
      singles(3, 3, 1, "b"),
      doubles(4, [1, 3], [2, 4], "a"),
      singles(5, 4, 2, "a"),
    ];
    const { ratings } = replay(players, matches, [{ matchId: 3 }]);
    const total = [...ratings.values()].reduce((s, r) => s + r, 0);
    expect(total).toBeCloseTo(START_RATING * players.length, 9);
  });
});
