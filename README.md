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
- Docker (for local Postgres + pgvector), **or** any Postgres 16+ with [`pgvector`](https://github.com/pgvector/pgvector)

## Local database (Docker + pgvector)

Exact steps from a clean checkout:

```bash
git clone https://github.com/armanyigit/public-opinion.git
cd public-opinion
npm install
cp .env.example .env.local
# DATABASE_URL already matches docker-compose.yml:
# postgresql://postgres:postgres@localhost:5432/public_opinion

# Start Postgres (pgvector/pgvector:pg16). First boot runs
# drizzle/0000_enable_pgvector.sql via docker-entrypoint-initdb.d.
npm run db:up

# Wait for readiness, CREATE EXTENSION vector (idempotent), push Drizzle schema:
npm run db:setup
```

`npm run db:setup` is equivalent to:

```bash
docker compose up -d
node scripts/wait-for-db.mjs
npm run db:extension   # CREATE EXTENSION IF NOT EXISTS vector
npm run db:push        # drizzle-kit push against DATABASE_URL
```

Useful commands:

| Command | Purpose |
| --- | --- |
| `npm run db:up` | `docker compose up -d` |
| `npm run db:down` | `docker compose down` (keeps volume) |
| `npm run db:extension` | Ensure `vector` extension exists |
| `npm run db:push` | Push `src/db/schema.ts` to the DB |
| `npm run db:setup` | up → wait → extension → push |
| `npm run db:studio` | Drizzle Studio |

Compose service details (`docker-compose.yml`):

- Image: `pgvector/pgvector:pg16`
- User / password / DB: `postgres` / `postgres` / `public_opinion`
- Port: `5432`
- Volume: `public_opinion_pgdata`
- Init SQL: `drizzle/0000_enable_pgvector.sql` → `CREATE EXTENSION IF NOT EXISTS vector;`

To wipe the DB volume and re-init:

```bash
docker compose down -v
npm run db:setup
```

### Without Docker

Point `DATABASE_URL` at any Postgres 16+ host that can install pgvector, then:

```bash
psql "$DATABASE_URL" -f drizzle/0000_enable_pgvector.sql
# or: npm run db:extension
npm run db:push
```

## App setup

```bash
cp .env.example .env.local
# fill AUTH_SECRET (required for auth); optional Google + NEWSDATA_API_KEY + LLM_API_KEY
openssl rand -base64 32   # paste into AUTH_SECRET
npm run db:setup          # if not already done
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The home page is a **mock trending feed** (category chips, poll cards, source corner, expand control) until ingest + feed APIs are wired.

Drizzle Kit loads env from `.env.local`, then `.env`.

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
drizzle/
  0000_enable_pgvector.sql
docker-compose.yml
scripts/
  wait-for-db.mjs
  db-enable-pgvector.mjs
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
| `npm run db:up` / `db:down` | Start / stop Compose Postgres |
| `npm run db:extension` | Enable pgvector |
| `npm run db:generate` | Drizzle SQL migrations |
| `npm run db:push` | Push schema to DATABASE_URL |
| `npm run db:setup` | Compose up + extension + push |
| `npm run db:studio` | Drizzle Studio |

## Product locks

Internal design docs (auth/feed/dedup, ingest tooling, legal posture) live in the project agent store — not this repo. Engineering should treat Postgres + pgvector + metadata-only news refs + two-layer dedup as locked.
