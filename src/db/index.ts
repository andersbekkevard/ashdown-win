/**
 * Lazy Neon client. Nothing connects until the first query, so `next build`
 * can evaluate pages without DATABASE_URL set.
 */
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export type Db = NeonHttpDatabase<typeof schema>;

let cached: Db | undefined;

export function getDb(): Db {
  if (cached) return cached;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.",
    );
  }
  // Local development against a plain Postgres behind a Neon HTTP proxy.
  // Unset in production, where the driver talks to Neon directly.
  const localEndpoint = process.env.NEON_LOCAL_HTTP_ENDPOINT;
  if (localEndpoint) {
    neonConfig.fetchEndpoint = localEndpoint;
  }
  cached = drizzle(neon(url), { schema });
  return cached;
}
