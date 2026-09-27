/**
 * Poll generation stub — LLM draft after story clustering.
 *
 * Flow (locked):
 *   StoryCluster (no active poll) → LLM draft → near-dupe gate → mod queue → live
 *
 * Never generate a second poll for a cluster that already has a live/queued poll
 * unless novelty reopen criteria pass (see auth-feed-dedup-design.md).
 */

import { checkPollNearDupe } from "./near-dupe-gate";

export type PollDraft = {
  clusterId: string;
  question: string;
  options: string[];
  category: string;
  market: string;
};

export async function draftPollForCluster(clusterId: string): Promise<PollDraft> {
  void clusterId;
  if (!process.env.LLM_API_KEY) {
    throw new Error("LLM_API_KEY is not set");
  }
  // TODO: call LLM with cluster article titles/entities; return catchy poll framing
  throw new Error("TODO: draftPollForCluster not implemented — scaffold stub only");
}

export async function publishPollDraft(draft: PollDraft) {
  const gate = await checkPollNearDupe({
    question: draft.question,
    optionLabels: draft.options,
    market: draft.market,
  });

  if (gate.action === "reject") {
    return { status: "rejected" as const, gate };
  }
  if (gate.action === "queue") {
    return { status: "queued" as const, gate };
  }

  // TODO: insert Poll + PollOption + PollSource rows, set cluster.activePollId
  return { status: "live" as const, gate };
}
