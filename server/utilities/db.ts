import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@shared/schema";

// 1. Load database URL
const dbUrl = process.env.DATABASE_URL;

// 2. Validate presence of DATABASE_URL
if (!dbUrl || dbUrl.trim() === "") {
  throw new Error(
    "❌ DATABASE_URL is missing.\n" +
    "Please add it to your .env file. Example:\n" +
    "DATABASE_URL=postgresql://user:password@host:5432/dbname"
  );
}

// 3. Validate URL structure
if (!dbUrl.startsWith("postgres://") && !dbUrl.startsWith("postgresql://")) {
  throw new Error(
    `❌ Invalid DATABASE_URL format: "${dbUrl}"\n` +
    "It must start with postgres:// or postgresql://"
  );
}

console.log("🔍 DATABASE_URL found. Attempting to connect...");

// 4. Create PostgreSQL connection pool
// Use sslmode=disable for local Postgres that don't support SSL. Set DATABASE_SSL_MODE=require (or no-verify) for cloud DBs that require SSL.
const sslMode = process.env.DATABASE_SSL_MODE ?? "disable";
const pool = new Pool({
  connectionString: dbUrl + (dbUrl.includes("?") ? "&" : "?") + `sslmode=${sslMode}`,
});

// 5. Test the DB connection immediately
pool
  .connect()
  .then((client) => {
    console.log("✅ PostgreSQL connected successfully!");
    client.release();
  })
  .catch((err) => {
    console.error("❌ Failed to connect to PostgreSQL:");
    console.error(err.message);
    process.exit(1); // stop server
  });

// 6. Initialize Drizzle ORM
export const db = drizzle(pool, { schema });

