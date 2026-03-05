import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

const dbUrl = process.env.DATABASE_URL;
const sslMode = process.env.DATABASE_SSL_MODE ?? "disable";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl + (dbUrl.includes("?") ? "&" : "?") + `sslmode=${sslMode}`,
  },
});
