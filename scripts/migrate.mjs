// Migration gate for the build. By default the build never migrates: the
// sanctioned path is scripts/migrate-prod.sh from Europa, which exports the
// log first. Setting ALLOW_BUILD_MIGRATIONS=1 in the Vercel environment turns
// build-time migration back on for a deliberate deploy.
import { spawnSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.log("migrate: DATABASE_URL not set, skipping");
  process.exit(0);
}
if (process.env.ALLOW_BUILD_MIGRATIONS !== "1") {
  console.log("migrate: skipped; production migrations run from Europa via scripts/migrate-prod.sh (set ALLOW_BUILD_MIGRATIONS=1 to override)");
  process.exit(0);
}
if (process.env.NEON_LOCAL_HTTP_ENDPOINT) {
  console.log("migrate: local Neon proxy configured, skipping (apply drizzle/*.sql with psql)");
  process.exit(0);
}
const r = spawnSync("pnpm", ["exec", "drizzle-kit", "migrate"], { stdio: "inherit" });
process.exit(r.status ?? 1);
