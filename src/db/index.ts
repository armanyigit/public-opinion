import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * Lazy DB client — only connects when DATABASE_URL is set.
 * Feed shell uses mock data when DB is unavailable.
 */
function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    return null;
  }
  const client = postgres(url, { max: 10 });
  return drizzle(client, { schema });
}

export const db = createDb();
export type Db = NonNullable<typeof db>;
export { schema };
