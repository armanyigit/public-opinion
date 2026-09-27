import type { DiscoveredArticle, MarketLane, NewsProvider, VolumePoint } from "./types";

/**
 * TODO: Implement GDELT DOC 2.0 primary ingest.
 * - ArtList / TimelineVol for persistence scoring
 * - sourcelang + sourcecountry market lanes
 * - Map responses → metadata-only DiscoveredArticle (discard any body fields)
 *
 * @see https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/
 */
export class GdeltDocProvider implements NewsProvider {
  readonly name = "gdelt";

  async discover(
    windowHours: number,
    markets: MarketLane[],
  ): Promise<DiscoveredArticle[]> {
    void windowHours;
    void markets;
    throw new Error("TODO: GdeltDocProvider.discover not implemented");
  }

  async volumeSeries(
    query: string,
    windowDays: number,
  ): Promise<VolumePoint[]> {
    void query;
    void windowDays;
    throw new Error("TODO: GdeltDocProvider.volumeSeries not implemented");
  }

  async health() {
    return { ok: true, detail: "stub — not calling GDELT yet" };
  }
}
