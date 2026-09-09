"use server";

/**
 * Write side. Every action validates with zod, appends a row, and revalidates
 * the pages that read from the log. Nothing here updates or deletes a row.
 * Database failures are caught and returned as errors so a form keeps what
 * the user typed.
 */
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { deletions, matches, players, restores } from "@/db/schema";
import { MAX_NAME_LENGTH } from "@/lib/config";
import { deviceLabel } from "@/lib/device";
import { effectiveDeletions } from "@/lib/log";
import { hasVisibleContent, normalizeName } from "@/lib/names";
import {
  findPlayerByName,
  searchPlayers as searchPlayersQuery,
  type PlayerHit,
} from "@/lib/queries";

export type ActionResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string; existing?: PlayerHit };

const DB_ERROR = "The table wobbled and nothing was saved. Try again.";

const nameSchema = z
  .string({ error: "Enter a name." })
  .transform(normalizeName)
  .pipe(
    z
      .string()
      .min(1, "Enter a name.")
      .max(MAX_NAME_LENGTH, `Names are at most ${MAX_NAME_LENGTH} characters.`)
      .refine(hasVisibleContent, "A name needs at least one letter or digit."),
  );

const idSchema = z.number().int().positive();

const sideSchema = z.tuple([idSchema]).or(z.tuple([idSchema, idSchema]));

const matchSchema = z
  .object({
    a: sideSchema,
    b: sideSchema,
    winner: z.enum(["a", "b"]),
  })
  .refine((m) => m.a.length === m.b.length, {
    message: "Both sides need the same number of players.",
  })
  .refine((m) => new Set([...m.a, ...m.b]).size === m.a.length + m.b.length, {
    message: "A player can only appear once in a match.",
  });

export type RecordMatchInput = z.input<typeof matchSchema>;

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/log");
  revalidatePath("/players/[id]", "page");
}

export async function createPlayer(rawName: unknown): Promise<ActionResult<PlayerHit>> {
  const parsed = nameSchema.safeParse(rawName);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid name." };
  }
  const name = parsed.data;

  try {
    const existing = await findPlayerByName(name);
    if (existing) {
      return { ok: false, error: `A player named "${existing.name}" already exists.`, existing };
    }
    const device = await deviceLabel();
    const [row] = await getDb()
      .insert(players)
      .values({ name, device })
      .returning({ id: players.id, name: players.name });
    revalidateAll();
    return { ok: true, value: row };
  } catch {
    // Either the unique index on lower(name) caught a race, or the database
    // is unreachable. Tell the two apart with one more read.
    try {
      const raced = await findPlayerByName(name);
      if (raced) {
        return { ok: false, error: `A player named "${raced.name}" already exists.`, existing: raced };
      }
    } catch {
      // fall through
    }
    return { ok: false, error: DB_ERROR };
  }
}

export async function recordMatch(input: unknown): Promise<ActionResult<{ id: number }>> {
  const parsed = matchSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid match." };
  }
  const { a, b, winner } = parsed.data;

  try {
    const db = getDb();
    const ids = [...a, ...b];
    const known = await db.select({ id: players.id }).from(players).where(inArray(players.id, ids));
    if (known.length !== ids.length) {
      return { ok: false, error: "One of the players does not exist." };
    }
    const device = await deviceLabel();
    const [row] = await db
      .insert(matches)
      .values({ a1: a[0], a2: a[1] ?? null, b1: b[0], b2: b[1] ?? null, winner, device })
      .returning({ id: matches.id });
    revalidateAll();
    return { ok: true, value: row };
  } catch {
    return { ok: false, error: DB_ERROR };
  }
}

/** Current deletion state of one match, from its own rows only. */
async function matchState(matchId: number) {
  const db = getDb();
  const [match] = await db.select({ id: matches.id }).from(matches).where(eq(matches.id, matchId)).limit(1);
  if (!match) return null;
  const dels = await db.select().from(deletions).where(eq(deletions.matchId, matchId));
  const rests = dels.length
    ? await db.select().from(restores).where(inArray(restores.deletionId, dels.map((d) => d.id)))
    : [];
  return effectiveDeletions(dels, rests).get(matchId) ?? { deleted: false, deletionId: null, deletedAt: null };
}

export async function deleteMatch(rawMatchId: unknown): Promise<ActionResult<{ id: number }>> {
  const parsed = idSchema.safeParse(rawMatchId);
  if (!parsed.success) return { ok: false, error: "Invalid match id." };
  const matchId = parsed.data;

  try {
    const state = await matchState(matchId);
    if (!state) return { ok: false, error: "That match does not exist." };
    if (state.deleted) return { ok: false, error: "That match is already deleted." };
    const device = await deviceLabel();
    const [row] = await getDb()
      .insert(deletions)
      .values({ matchId, device })
      .returning({ id: deletions.id });
    revalidateAll();
    return { ok: true, value: row };
  } catch {
    return { ok: false, error: DB_ERROR };
  }
}

/** Cancel the deletion currently in force for a match. */
export async function restoreMatch(rawMatchId: unknown): Promise<ActionResult<{ id: number }>> {
  const parsed = idSchema.safeParse(rawMatchId);
  if (!parsed.success) return { ok: false, error: "Invalid match id." };
  const matchId = parsed.data;

  try {
    const state = await matchState(matchId);
    if (!state) return { ok: false, error: "That match does not exist." };
    if (!state.deleted || state.deletionId === null) {
      return { ok: false, error: "That match is not deleted." };
    }
    const device = await deviceLabel();
    const [row] = await getDb()
      .insert(restores)
      .values({ deletionId: state.deletionId, device })
      .returning({ id: restores.id });
    revalidateAll();
    return { ok: true, value: row };
  } catch {
    // Unique deletion_id: someone restored it first. Either way it is restored.
    const state = await matchState(matchId).catch(() => null);
    if (state && !state.deleted) return { ok: false, error: "That match was already restored." };
    return { ok: false, error: DB_ERROR };
  }
}

export async function searchPlayers(query: unknown): Promise<PlayerHit[]> {
  const parsed = z.string().max(MAX_NAME_LENGTH).safeParse(query);
  if (!parsed.success) return [];
  try {
    return await searchPlayersQuery(normalizeName(parsed.data));
  } catch {
    return [];
  }
}
