/**
 * Layer B — poll-text near-dupe gate (after LLM draft, before publish).
 *
 * TODO:
 * - Embed candidate question (+ options) with multilingual-e5-base
 * - ANN search live + recently retired polls (30–90 day window) via pgvector
 * - Reject / queue if cosine ≥ high threshold; bias toward blocking false dupes
 * - Optional cross-encoder re-rank on borderline top-k
 */

export type NearDupeResult =
  | { action: "allow" }
  | { action: "reject"; matchedPollId: string; score: number }
  | { action: "queue"; matchedPollId: string; score: number };

export async function checkPollNearDupe(input: {
  question: string;
  optionLabels: string[];
  market: string;
}): Promise<NearDupeResult> {
  void input;
  throw new Error("TODO: checkPollNearDupe not implemented — scaffold stub only");
}
