# Scripts

| Script | What it does |
|---|---|
| `migrate.mjs` | Runs pending Drizzle migrations before `next build` when `DATABASE_URL` is set. Vercel runs it on every deploy. |
| `db.sh` | `psql` against the production Neon database using `.env.production.local`. Interactive, `-c "sql"`, or stdin. |
| `delete-player.sh "Name"` | Owner cleanup: hard-deletes a player with their matches and related deletions. Not a site feature. |

`.env.production.local` comes from `vercel env pull .env.production.local
--environment=production` after `vercel link`. It is git-ignored. Never paste
its contents into a chat or a commit.
