import { describe, expect, it } from "vitest";
import { currentStreak } from "./streak";

const h = (...deltas: number[]) =>
  deltas.map((delta, i) => ({ matchId: i + 1, at: new Date(i * 1000), delta, rating: 1000 + delta }));

describe("currentStreak", () => {
  it("counts trailing wins only", () => {
    expect(currentStreak(h(16, -8, 12, 11, 9))).toBe(3);
  });
  it("is zero after a loss", () => {
    expect(currentStreak(h(16, 12, -8))).toBe(0);
  });
  it("is zero with no matches", () => {
    expect(currentStreak([])).toBe(0);
  });
  it("counts an unbroken run entirely", () => {
    expect(currentStreak(h(5, 6, 7, 8))).toBe(4);
  });
});
