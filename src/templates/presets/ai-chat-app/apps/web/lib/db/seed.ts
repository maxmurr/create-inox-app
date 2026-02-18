import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";

import * as schema from "./schema";

const DATABASE_URL = process.env.DATABASE_URL;
const SEED_EMAILS = process.env.SEED_EMAILS;
const SEED_PASSWORD = "CHANGE_ME";

if (!DATABASE_URL) {
  process.stderr.write(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "error",
      event: "db:seed",
      outcome: "failure",
      error: "DATABASE_URL is not set",
    }) + "\n",
  );
  process.exit(1);
}

if (!SEED_EMAILS) {
  process.stderr.write(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "error",
      event: "db:seed",
      outcome: "failure",
      error: "SEED_EMAILS is not set",
    }) + "\n",
  );
  process.exit(1);
}

function deriveName(email: string): string {
  const prefix = email.split("@")[0] ?? email;
  return prefix
    .split(/[.\-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const start = performance.now();
const pool = new Pool({ connectionString: DATABASE_URL });

try {
  const db = drizzle(pool);

  const auth = betterAuth({
    database: drizzleAdapter(db, { provider: "pg", schema }),
    secret: process.env.BETTER_AUTH_SECRET ?? "CHANGE_ME",
    baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
    emailAndPassword: { enabled: true },
  });

  const emails = SEED_EMAILS.split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  for (const email of emails) {
    const name = deriveName(email);

    try {
      const result = await auth.api.signUpEmail({
        body: { email, password: SEED_PASSWORD, name },
      });

      if (result.user) {
        process.stdout.write(
          JSON.stringify({
            timestamp: new Date().toISOString(),
            level: "info",
            event: "db:seed",
            action: "user_created",
            email,
            name,
          }) + "\n",
        );
      }
    } catch {
      process.stdout.write(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level: "info",
          event: "db:seed",
          action: "user_skipped",
          email,
          reason: "already exists",
        }) + "\n",
      );
    }
  }

  const durationMs = Math.round(performance.now() - start);
  process.stdout.write(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "info",
      event: "db:seed",
      duration_ms: durationMs,
      outcome: "success",
      users_processed: emails.length,
    }) + "\n",
  );
} catch (err) {
  const durationMs = Math.round(performance.now() - start);
  process.stderr.write(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: "error",
      event: "db:seed",
      duration_ms: durationMs,
      outcome: "failure",
      error: err instanceof Error ? err.message : String(err),
    }) + "\n",
  );
  process.exit(1);
} finally {
  await pool.end();
}
