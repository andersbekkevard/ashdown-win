/**
 * The whole schema. Append-only: rows in these tables are inserted and never
 * updated or deleted. A match is voided by inserting a deletion that points at
 * it. There are no stored ratings; see docs/architecture.md.
 */
import { sql } from "drizzle-orm";
import {
  check,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const sideEnum = pgEnum("side", ["a", "b"]);

export const players = pgTable(
  "players",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("players_name_lower_idx").on(sql`lower(${t.name})`)],
);

export const matches = pgTable(
  "matches",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    a1: integer("a1")
      .notNull()
      .references(() => players.id),
    a2: integer("a2").references(() => players.id),
    b1: integer("b1")
      .notNull()
      .references(() => players.id),
    b2: integer("b2").references(() => players.id),
    winner: sideEnum("winner").notNull(),
  },
  (t) => [
    // Singles has a2 and b2 both null; doubles has both set.
    check("matches_same_side_size", sql`(${t.a2} is null) = (${t.b2} is null)`),
    // A player appears at most once in a match.
    check(
      "matches_distinct_players",
      sql`${t.a1} <> ${t.b1}
        and (${t.a2} is null or (${t.a2} <> ${t.a1} and ${t.a2} <> ${t.b1}))
        and (${t.b2} is null or (${t.b2} <> ${t.a1} and ${t.b2} <> ${t.b1}))
        and (${t.a2} is null or ${t.b2} is null or ${t.a2} <> ${t.b2})`,
    ),
  ],
);

export const deletions = pgTable("deletions", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id")
    .notNull()
    .unique()
    .references(() => matches.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type PlayerRow = typeof players.$inferSelect;
export type MatchRow = typeof matches.$inferSelect;
export type DeletionRow = typeof deletions.$inferSelect;
