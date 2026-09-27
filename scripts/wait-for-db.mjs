#!/usr/bin/env node
/**
 * Wait until DATABASE_URL accepts connections (Compose health / cold start).
 */
import { config } from "dotenv";
import postgres from "postgres";

config({ path: ".env.local" });
config({ path: ".env" });

const url = process.env.DATABASE_URL;
if (!url) {
  console.error(
    "DATABASE_URL is not set. Copy .env.example → .env.local and set it.",
  );
  process.exit(1);
}

const maxAttempts = Number(process.env.DB_WAIT_ATTEMPTS ?? 40);
const delayMs = Number(process.env.DB_WAIT_MS ?? 500);

for (let i = 1; i <= maxAttempts; i++) {
  const sql = postgres(url, { max: 1, connect_timeout: 2 });
  try {
    await sql`select 1`;
    await sql.end({ timeout: 1 });
    console.log(`Postgres ready (attempt ${i})`);
    process.exit(0);
  } catch {
    await sql.end({ timeout: 1 }).catch(() => {});
    if (i === maxAttempts) {
      console.error(
        `Postgres not reachable after ${maxAttempts} attempts: ${url}`,
      );
      process.exit(1);
    }
    await new Promise((r) => setTimeout(r, delayMs));
  }
}
