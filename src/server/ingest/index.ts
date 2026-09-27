/**
 * Ingest worker stub — batch cadence ≤3×/day.
 *
 * Pipeline (locked):
 *   ingest → persistence gate → embed + entities → story cluster
 *   → (one active poll slot per cluster) → poll draft elsewhere
 *
 * This module is intentionally unimplemented in the scaffold.
 */

import { GdeltDocProvider } from "./providers/gdelt";
import { NewsdataProvider } from "./providers/newsdata";
import type { MarketLane } from "./providers/types";

export const DEFAULT_MARKETS: MarketLane[] = [
  { id: "tr-tr", country: "tr", language: "tr" },
  { id: "us-en", country: "us", language: "en" },
];

export async function runIngestBatch(markets: MarketLane[] = DEFAULT_MARKETS) {
  const primary = new GdeltDocProvider();
  const secondary = new NewsdataProvider();

  // TODO:
  // 1. primary.discover + optional volumeSeries persistence score
  // 2. secondary fill for citation-quality publishers
  // 3. URL normalize → upsert ArticleRef (metadata only)
  // 4. embed (multilingual-e5-base) + entity fingerprint
  // 5. assign/merge StoryCluster (pgvector ANN); attach sources if poll exists
  void markets;
  void primary;
  void secondary;

  throw new Error("TODO: runIngestBatch not implemented — scaffold stub only");
}
