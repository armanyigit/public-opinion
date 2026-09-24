# Public Opinion

News-driven polls web app. Vote and comment on catchy polls tied to real news stories with sustained multi-outlet coverage.

**v1 markets:** Turkish (TR) + English (EN). Architecture expands worldwide via market-lane config.

## Stack

- **Next.js** (App Router) + TypeScript — web UI + API routes
- **Postgres + pgvector** via **Drizzle ORM**
- **Auth.js** (NextAuth v5) — email/password + Google (email verification required before vote/comment)
- Metadata-only `ArticleRef` citations — **never** store full article bodies

## Prerequisites

- Node.js 20+
- Postgres 16+ with the [`pgvector`](https://github.com/pgvector/pgvector) extension

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

## Setup

```bash
git clone https://github.com/armanyigit/public-opinion.git
cd public-opinion
npm install
cp .env.example .env.local
# fill DATABASE_URL, AUTH_SECRET, optional Google + NEWSDATA_API_KEY + LLM_API_KEY
```

Generate an auth secret:

```bash
openssl rand -base64 32
```

Push the schema (once `DATABASE_URL` points at a pgvector-enabled DB):

```bash
npm run db:push
# or generate SQL migrations:
npm run db:generate
```

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The home page is a **mock trending feed** (category chips, poll cards, source corner, expand control) until ingest + feed APIs are wired.

## Project structure

```
src/
  app/                  # App Router pages + Auth.js API route
  components/feed/      # Trending feed shell (mock data)
  db/                   # Drizzle client + schema stubs
  lib/                  # Auth helpers, mock feed
  server/
    ingest/             # TODO: GDELT primary + Newsdata secondary worker
    poll-generation/    # TODO: LLM draft + near-dupe gate
```

### Schema stubs

`User` / `Profile`, `Vote`, `Comment`, `ArticleRef`, `StoryCluster`, `Poll` (+ options), `PollSource`, plus Auth.js `accounts` / `sessions` / `verification_tokens`.

### Intentionally not built yet

- GDELT / Newsdata ingest worker (stubs under `src/server/ingest`)
- Embedding + story clustering + poll near-dupe gate
- Live vote / comment APIs (email-verify gate helpers stubbed in `src/lib/auth.ts`)
- Moderation queue UI

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
| `npm run db:generate` | Drizzle SQL migrations |
| `npm run db:push` | Push schema to DATABASE_URL |
| `npm run db:studio` | Drizzle Studio |

## Product locks

Internal design docs (auth/feed/dedup, ingest tooling, legal posture) live in the project agent store — not this repo. Engineering should treat Postgres + pgvector + metadata-only news refs + two-layer dedup as locked.
