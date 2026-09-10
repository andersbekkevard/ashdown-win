# Scripts

| Script | What it does |
|---|---|
| `migrate.mjs` | Build-time migration gate. Skips unless `ALLOW_BUILD_MIGRATIONS=1`; the sanctioned path is `migrate-prod.sh`. |
| `export-log.sh` | Exports every table as JSON into the private backup repo and pushes. Daily timer on Europa; also the first step of `migrate-prod.sh`. |
| `migrate-prod.sh` | Exports the log, then applies pending migrations to production. The only sanctioned way to migrate. |
| `db.sh` | `psql` against the production Neon database using `.env.production.local`. Interactive, `-c "sql"`, or stdin. |
| `reset-prod.sh` | Launch wipe: exports the log, then truncates every table with sequences restarted so ids begin at 1. Asks for the word RESET. |
| `delete-player.sh "Name"` | Owner cleanup: hard-deletes a player with their matches and related deletions, then resyncs the id sequences so the next entry continues from the highest remaining id (or 1). Not a site feature. |

`.env.production.local` comes from `vercel env pull .env.production.local
--environment=production` after `vercel link`. It is git-ignored. Never paste
its contents into a chat or a commit.
