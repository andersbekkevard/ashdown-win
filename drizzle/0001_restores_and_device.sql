CREATE TABLE "restores" (
	"id" serial PRIMARY KEY NOT NULL,
	"deletion_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"device" text,
	CONSTRAINT "restores_deletion_id_unique" UNIQUE("deletion_id")
);
--> statement-breakpoint
ALTER TABLE "deletions" DROP CONSTRAINT "deletions_match_id_unique";--> statement-breakpoint
ALTER TABLE "deletions" ADD COLUMN "device" text;--> statement-breakpoint
ALTER TABLE "matches" ADD COLUMN "device" text;--> statement-breakpoint
ALTER TABLE "players" ADD COLUMN "device" text;--> statement-breakpoint
ALTER TABLE "restores" ADD CONSTRAINT "restores_deletion_id_deletions_id_fk" FOREIGN KEY ("deletion_id") REFERENCES "public"."deletions"("id") ON DELETE no action ON UPDATE no action;