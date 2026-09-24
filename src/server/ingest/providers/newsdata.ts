import type { DiscoveredArticle, MarketLane, NewsProvider } from "./types";

/**
 * TODO: Implement Newsdata.io secondary provider for citation quality.
 * - country=tr&language=tr (and EN lanes)
 * - Map to metadata-only DTO — do NOT persist full content even if API returns it
 *
 * Requires NEWSDATA_API_KEY.
 */
export class NewsdataProvider implements NewsProvider {
  readonly name = "newsdata";

  async discover(
    windowHours: number,
    markets: MarketLane[],
  ): Promise<DiscoveredArticle[]> {
    void windowHours;
    void markets;
    if (!process.env.NEWSDATA_API_KEY) {
      throw new Error("NEWSDATA_API_KEY is not set");
    }
    throw new Error("TODO: NewsdataProvider.discover not implemented");
  }

  async health() {
    return {
      ok: Boolean(process.env.NEWSDATA_API_KEY),
      detail: process.env.NEWSDATA_API_KEY
        ? "stub — key present, not calling API yet"
        : "NEWSDATA_API_KEY missing",
    };
  }
}
