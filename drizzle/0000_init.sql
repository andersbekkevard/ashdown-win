CREATE TYPE "public"."side" AS ENUM('a', 'b');--> statement-breakpoint
CREATE TABLE "deletions" (
	"id" serial PRIMARY KEY NOT NULL,
	"match_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "deletions_match_id_unique" UNIQUE("match_id")
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"a1" integer NOT NULL,
	"a2" integer,
	"b1" integer NOT NULL,
	"b2" integer,
	"winner" "side" NOT NULL,
	CONSTRAINT "matches_same_side_size" CHECK (("matches"."a2" is null) = ("matches"."b2" is null)),
	CONSTRAINT "matches_distinct_players" CHECK ("matches"."a1" <> "matches"."b1"
        and ("matches"."a2" is null or ("matches"."a2" <> "matches"."a1" and "matches"."a2" <> "matches"."b1"))
        and ("matches"."b2" is null or ("matches"."b2" <> "matches"."a1" and "matches"."b2" <> "matches"."b1"))
        and ("matches"."a2" is null or "matches"."b2" is null or "matches"."a2" <> "matches"."b2"))
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "deletions" ADD CONSTRAINT "deletions_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_a1_players_id_fk" FOREIGN KEY ("a1") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_a2_players_id_fk" FOREIGN KEY ("a2") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_b1_players_id_fk" FOREIGN KEY ("b1") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_b2_players_id_fk" FOREIGN KEY ("b2") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "players_name_lower_idx" ON "players" USING btree (lower("name"));