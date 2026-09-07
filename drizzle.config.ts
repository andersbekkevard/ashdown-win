import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    // Only db:migrate needs this; db:generate works without a database.
    url: process.env.DATABASE_URL ?? "",
  },
});
