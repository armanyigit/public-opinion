/**
 * News provider adapter contract.
 *
 * Locked providers (see docs/news-ingest-tooling.md):
 * - Primary: GDELT DOC 2.0
 * - Secondary: Newsdata.io (+ locale RSS validation)
 *
 * Adapters MUST return metadata-only ArticleRef DTOs — never full bodies.
 */

export type MarketLane = {
  /** e.g. "tr-tr", "us-en" */
  id: string;
  country: string;
  language: string;
};

export type DiscoveredArticle = {
  url: string;
  title: string;
  publisher: string;
  publishedAt: Date | null;
  lang: string;
  country: string;
  provider: "gdelt" | "newsdata" | "rss";
  providerItemId?: string;
};

export type VolumePoint = {
  at: Date;
  value: number;
};

export interface NewsProvider {
  readonly name: string;
  discover(windowHours: number, markets: MarketLane[]): Promise<DiscoveredArticle[]>;
  volumeSeries?(
    query: string,
    windowDays: number,
  ): Promise<VolumePoint[]>;
  health(): Promise<{ ok: boolean; detail?: string }>;
}
