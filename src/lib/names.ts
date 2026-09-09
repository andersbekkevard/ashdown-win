/**
 * Player-name normalisation. A name is the only identity in the system, so
 * two strings that render the same must be the same name. NFKC folds
 * composed/decomposed accents and full-width forms; invisible and control
 * characters are removed; runs of any whitespace become one space.
 */
export function normalizeName(raw: string): string {
  return raw
    .normalize("NFKC")
    .replace(/[\p{Cf}\p{Cc}\p{Co}\p{Cn}]/gu, "")
    .replace(/[\p{Zs}\p{Zl}\p{Zp}\s]+/gu, " ")
    .trim();
}

/** A name must contain at least one letter or digit. */
export function hasVisibleContent(name: string): boolean {
  return /[\p{L}\p{N}]/u.test(name);
}
