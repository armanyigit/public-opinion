/**
 * Postgres + pgvector schema stubs for public-opinion v1.
 *
 * Storage locks:
 * - Metadata-only ArticleRef (never full article bodies)
 * - Embeddings via pgvector (multilingual-e5-base → 768 dims)
 * - One active poll slot per StoryCluster (enforced in app logic later)
 */
import { relations } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  vector,
} from "drizzle-orm/pg-core";

export const trustTierEnum = pgEnum("trust_tier", [
  "new",
  "standard",
  "elevated",
  "restricted",
]);

export const pollStatusEnum = pgEnum("poll_status", [
  "draft",
  "queued",
  "live",
  "rejected",
  "retired",
]);

export const pollCategoryEnum = pgEnum("poll_category", [
  "politics",
  "economy",
  "society",
  "tech",
  "sports",
  "world",
  "other",
]);

// —— Auth / profiles ————————————————————————————————————————————————

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  passwordHash: text("password_hash"),
  trustTier: trustTierEnum("trust_tier").notNull().default("new"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const profiles = pgTable("profiles", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  displayName: text("display_name").notNull(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  voteCountPublic: integer("vote_count_public").notNull().default(0),
  commentCountPublic: integer("comment_count_public").notNull().default(0),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

/** Auth.js / NextAuth adapter tables */
export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (t) => [primaryKey({ columns: [t.provider, t.providerAccountId] })],
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

// —— News graph (metadata only) ——————————————————————————————————————

/**
 * Citation metadata only — never store full article bodies, extractions,
 * or publisher media binaries.
 */
export const articleRefs = pgTable(
  "article_refs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    url: text("url").notNull(),
    title: text("title").notNull(),
    publisher: text("publisher").notNull(),
    publishedAt: timestamp("published_at", { mode: "date" }),
    lang: text("lang").notNull(),
    country: text("country").notNull(),
    provider: text("provider").notNull(), // gdelt | newsdata | rss | …
    providerItemId: text("provider_item_id"),
    /** multilingual-e5-base embedding; null until embed worker runs */
    embedding: vector("embedding", { dimensions: 768 }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("article_refs_url_uidx").on(t.url),
    index("article_refs_embedding_idx").using("hnsw", t.embedding.op("vector_cosine_ops")),
  ],
);

export const storyClusters = pgTable(
  "story_clusters",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    market: text("market").notNull(), // e.g. tr-tr, us-en
    entitySet: jsonb("entity_set").$type<string[]>().notNull().default([]),
    persistenceScore: real("persistence_score"),
    embedding: vector("embedding", { dimensions: 768 }),
    activePollId: uuid("active_poll_id"),
    status: text("status").notNull().default("open"), // open | closed
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [
    index("story_clusters_embedding_idx").using(
      "hnsw",
      t.embedding.op("vector_cosine_ops"),
    ),
  ],
);

export const polls = pgTable(
  "polls",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clusterId: uuid("cluster_id").references(() => storyClusters.id, {
      onDelete: "set null",
    }),
    question: text("question").notNull(),
    category: pollCategoryEnum("category").notNull().default("other"),
    status: pollStatusEnum("status").notNull().default("draft"),
    market: text("market").notNull(),
    embedding: vector("embedding", { dimensions: 768 }),
    voteCount: integer("vote_count").notNull().default(0),
    commentCount: integer("comment_count").notNull().default(0),
    publishedAt: timestamp("published_at", { mode: "date" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [
    index("polls_status_published_idx").on(t.status, t.publishedAt),
    index("polls_embedding_idx").using("hnsw", t.embedding.op("vector_cosine_ops")),
  ],
);

export const pollOptions = pgTable(
  "poll_options",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    pollId: uuid("poll_id")
      .notNull()
      .references(() => polls.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    position: integer("position").notNull().default(0),
    voteCount: integer("vote_count").notNull().default(0),
  },
  (t) => [index("poll_options_poll_idx").on(t.pollId)],
);

/** Ordered citations for Sources detail chrome on poll cards. */
export const pollSources = pgTable(
  "poll_sources",
  {
    pollId: uuid("poll_id")
      .notNull()
      .references(() => polls.id, { onDelete: "cascade" }),
    articleRefId: uuid("article_ref_id")
      .notNull()
      .references(() => articleRefs.id, { onDelete: "cascade" }),
    position: integer("position").notNull().default(0),
  },
  (t) => [
    primaryKey({ columns: [t.pollId, t.articleRefId] }),
    index("poll_sources_poll_idx").on(t.pollId),
  ],
);

// —— Engagement ——————————————————————————————————————————————————————

/** One vote per poll per user; last write wins (upsert on unique key). */
export const votes = pgTable(
  "votes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    pollId: uuid("poll_id")
      .notNull()
      .references(() => polls.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    optionId: uuid("option_id")
      .notNull()
      .references(() => pollOptions.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("votes_poll_user_uidx").on(t.pollId, t.userId)],
);

/** Nested replies: one level deep (parent_id → top-level comment only). */
export const comments = pgTable(
  "comments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    pollId: uuid("poll_id")
      .notNull()
      .references(() => polls.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    parentId: uuid("parent_id"),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    removedAt: timestamp("removed_at", { mode: "date" }),
  },
  (t) => [index("comments_poll_idx").on(t.pollId)],
);

// —— Relations (for typed queries later) ——————————————————————————————

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, { fields: [users.id], references: [profiles.userId] }),
  accounts: many(accounts),
  sessions: many(sessions),
  votes: many(votes),
  comments: many(comments),
}));

export const pollsRelations = relations(polls, ({ one, many }) => ({
  cluster: one(storyClusters, {
    fields: [polls.clusterId],
    references: [storyClusters.id],
  }),
  options: many(pollOptions),
  sources: many(pollSources),
  votes: many(votes),
  comments: many(comments),
}));

export const pollSourcesRelations = relations(pollSources, ({ one }) => ({
  poll: one(polls, { fields: [pollSources.pollId], references: [polls.id] }),
  articleRef: one(articleRefs, {
    fields: [pollSources.articleRefId],
    references: [articleRefs.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type ArticleRef = typeof articleRefs.$inferSelect;
export type StoryCluster = typeof storyClusters.$inferSelect;
export type Poll = typeof polls.$inferSelect;
export type PollOption = typeof pollOptions.$inferSelect;
export type PollSource = typeof pollSources.$inferSelect;
export type Vote = typeof votes.$inferSelect;
export type Comment = typeof comments.$inferSelect;
