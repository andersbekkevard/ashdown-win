/**
 * Rating constants. This is the one config file named in docs/architecture.md
 * and docs/algorithm.md. Nothing else may hard-code these values; change them
 * here and every rating in history is recomputed from the log.
 */

/** K factor for singles matches (K_s in docs/algorithm.md). */
export const K_SINGLES = 32;

/** K factor for doubles matches (K_d in docs/algorithm.md). */
export const K_DOUBLES = 16;

/** Rating every player starts at (R_0 in docs/algorithm.md). */
export const START_RATING = 1000;

/** Maximum length of a player name, in characters. */
export const MAX_NAME_LENGTH = 60;

/** WhatsApp group for arranging games. Public invite, no approval gate. */
export const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/DWpOT0r3aUF3liyoaVOd8c";
