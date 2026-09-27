#!/usr/bin/env node
/**
 * Ensures the pgvector extension exists on DATABASE_URL.
 * Safe to re-run (IF NOT EXISTS). Requires Postgres reachable.
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

const sql = postgres(url, { max: 1 });

try {
  await sql`CREATE EXTENSION IF NOT EXISTS vector`;
  const rows = await sql`
    SELECT extname, extversion
    FROM pg_extension
    WHERE extname = 'vector'
  `;
  if (!rows.length) {
    console.error("pgvector extension was not enabled.");
    process.exit(1);
  }
  console.log(`pgvector enabled (version ${rows[0].extversion})`);
} catch (err) {
  console.error("Failed to enable pgvector:", err.message ?? err);
  process.exit(1);
} finally {
  await sql.end({ timeout: 5 });
}
