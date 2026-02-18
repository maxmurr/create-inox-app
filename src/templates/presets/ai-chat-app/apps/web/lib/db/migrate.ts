import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  process.stderr.write(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "error",
      event: "db:migrate",
      outcome: "failure",
      error: "DATABASE_URL is not set",
    }) + "\n",
  );
  process.exit(1);
}

const start = performance.now();
const pool = new Pool({ connectionString: DATABASE_URL });

try {
  const db = drizzle(pool);
  await migrate(db, { migrationsFolder: "migrations" });

  const durationMs = Math.round(performance.now() - start);
  process.stdout.write(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "info",
      event: "db:migrate",
      source_version: process.env.SOURCE_VERSION ?? "unknown",
      duration_ms: durationMs,
      outcome: "success",
    }) + "\n",
  );
} catch (err) {
  const durationMs = Math.round(performance.now() - start);
  process.stderr.write(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "error",
      event: "db:migrate",
      source_version: process.env.SOURCE_VERSION ?? "unknown",
      duration_ms: durationMs,
      outcome: "failure",
      error: err instanceof Error ? err.message : String(err),
    }) + "\n",
  );
  process.exit(1);
} finally {
  await pool.end();
}
