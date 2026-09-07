// Run pending migrations before a production build when a database is
// configured. Vercel sets DATABASE_URL through the Neon integration; local
// builds without one skip this step so `next build` still works offline.
import { spawnSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.log("migrate: DATABASE_URL not set, skipping");
  process.exit(0);
}
if (process.env.NEON_LOCAL_HTTP_ENDPOINT) {
  console.log("migrate: local Neon proxy configured, skipping (apply drizzle/*.sql with psql)");
  process.exit(0);
}
const r = spawnSync("pnpm", ["exec", "drizzle-kit", "migrate"], { stdio: "inherit" });
process.exit(r.status ?? 1);
