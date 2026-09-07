"use server";

/**
 * Write side. Every action validates with zod, appends a row, and revalidates
 * the pages that read from the log. Nothing here updates or deletes a row.
 */
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { deletions, matches, players } from "@/db/schema";
import { MAX_NAME_LENGTH } from "@/lib/config";
import {
  findPlayerByName,
  searchPlayers as searchPlayersQuery,
  type PlayerHit,
} from "@/lib/queries";

export type ActionResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string; existing?: PlayerHit };

const nameSchema = z
  .string({ error: "Enter a name." })
  .transform((s) => s.trim().replace(/\s+/g, " "))
  .pipe(
    z
      .string()
      .min(1, "Enter a name.")
      .max(MAX_NAME_LENGTH, `Names are at most ${MAX_NAME_LENGTH} characters.`),
  );

const idSchema = z.number().int().positive();

const sideSchema = z
  .tuple([idSchema])
  .or(z.tuple([idSchema, idSchema]));

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

export async function createPlayer(
  rawName: unknown,
): Promise<ActionResult<PlayerHit>> {
  const parsed = nameSchema.safeParse(rawName);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid name." };
  }
  const name = parsed.data;

  const existing = await findPlayerByName(name);
  if (existing) {
    return {
      ok: false,
      error: `A player named "${existing.name}" already exists.`,
      existing,
    };
  }

  try {
    const [row] = await getDb()
      .insert(players)
      .values({ name })
      .returning({ id: players.id, name: players.name });
    revalidateAll();
    return { ok: true, value: row };
  } catch {
    // Unique index on lower(name) caught a race with another creation.
    const raced = await findPlayerByName(name);
    if (raced) {
      return {
        ok: false,
        error: `A player named "${raced.name}" already exists.`,
        existing: raced,
      };
    }
    return { ok: false, error: "Could not create the player. Try again." };
  }
}

export async function recordMatch(
  input: unknown,
): Promise<ActionResult<{ id: number }>> {
  const parsed = matchSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid match." };
  }
  const { a, b, winner } = parsed.data;

  const db = getDb();
  const ids = [...a, ...b];
  const known = await db
    .select({ id: players.id })
    .from(players)
    .where(inArray(players.id, ids));
  if (known.length !== ids.length) {
    return { ok: false, error: "One of the players does not exist." };
  }

  const [row] = await db
    .insert(matches)
    .values({
      a1: a[0],
      a2: a[1] ?? null,
      b1: b[0],
      b2: b[1] ?? null,
      winner,
    })
    .returning({ id: matches.id });
  revalidateAll();
  return { ok: true, value: row };
}

export async function deleteMatch(
  rawMatchId: unknown,
): Promise<ActionResult<{ id: number }>> {
  const parsed = idSchema.safeParse(rawMatchId);
  if (!parsed.success) {
    return { ok: false, error: "Invalid match id." };
  }
  const matchId = parsed.data;
  const db = getDb();

  const [match] = await db
    .select({ id: matches.id })
    .from(matches)
    .where(eq(matches.id, matchId))
    .limit(1);
  if (!match) {
    return { ok: false, error: "That match does not exist." };
  }

  const [already] = await db
    .select({ id: deletions.id })
    .from(deletions)
    .where(eq(deletions.matchId, matchId))
    .limit(1);
  if (already) {
    return { ok: false, error: "That match is already deleted." };
  }

  try {
    const [row] = await db
      .insert(deletions)
      .values({ matchId })
      .returning({ id: deletions.id });
    revalidateAll();
    return { ok: true, value: row };
  } catch {
    // Unique constraint on match_id: someone else deleted it first.
    return { ok: false, error: "That match is already deleted." };
  }
}

export async function searchPlayers(query: unknown): Promise<PlayerHit[]> {
  const parsed = z.string().max(MAX_NAME_LENGTH).safeParse(query);
  if (!parsed.success) return [];
  return searchPlayersQuery(parsed.data);
}
