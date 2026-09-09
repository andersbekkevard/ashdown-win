import { describe, expect, it } from "vitest";
import { hasVisibleContent, normalizeName } from "./names";

const cp = (...codes: number[]) => String.fromCodePoint(...codes);
const ZWSP = cp(0x200b);
const ZWJ = cp(0x200d);
const BOM = cp(0xfeff);
const SOFT_HYPHEN = cp(0x00ad);
const COMBINING_ACUTE = cp(0x0301);
const FULLWIDTH_A = cp(0xff21);
const CIRCLED_ONE = cp(0x2460);
const CONTROL = cp(0x0001);

describe("normalizeName", () => {
  it("strips zero-width and other invisible characters", () => {
    expect(normalizeName(`Anders${ZWSP} Bekkevard${ZWJ}`)).toBe("Anders Bekkevard");
    expect(normalizeName(`${BOM}jchen26${SOFT_HYPHEN}`)).toBe("jchen26");
  });
  it("folds decomposed accents into composed form", () => {
    const decomposed = `Jose${COMBINING_ACUTE}`;
    const composed = "Jos" + cp(0x00e9);
    expect(normalizeName(decomposed)).toBe(composed);
    expect(normalizeName(decomposed)).toBe(normalizeName(composed));
  });
  it("folds full-width and compatibility forms", () => {
    expect(normalizeName(`${FULLWIDTH_A}nders`)).toBe("Anders");
    expect(normalizeName(CIRCLED_ONE)).toBe("1");
  });
  it("collapses whitespace of every kind", () => {
    expect(normalizeName("  Mei   Nakamura\t")).toBe("Mei Nakamura");
    expect(normalizeName(`Mei${cp(0x00a0)}Nakamura`)).toBe("Mei Nakamura");
  });
  it("removes control characters", () => {
    expect(normalizeName(`Bob${CONTROL}`)).toBe("Bob");
  });
});

describe("hasVisibleContent", () => {
  it("rejects punctuation-only and empty names", () => {
    expect(hasVisibleContent("")).toBe(false);
    expect(hasVisibleContent("---")).toBe(false);
    expect(hasVisibleContent("A")).toBe(true);
    expect(hasVisibleContent(cp(0x4e2d))).toBe(true);
  });
});
