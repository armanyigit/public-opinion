import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

/**
 * Auth.js entry — Google + credentials providers configured.
 * Drizzle adapter can replace JWT sessions once DATABASE_URL is set:
 *   import { DrizzleAdapter } from "@auth/drizzle-adapter"
 *   import { db } from "@/db"
 *   adapter: db ? DrizzleAdapter(db) : undefined
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // adapter: omitted until DATABASE_URL is configured in the environment
});

/** True when the user may vote/comment (verified email required). */
export function canEngage(user: {
  emailVerified?: Date | string | null;
} | null | undefined): boolean {
  return Boolean(user?.emailVerified);
}
