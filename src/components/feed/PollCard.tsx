"use client";

import { useState } from "react";
import type { MockPoll } from "@/lib/mock-feed";
import { SourcesCorner } from "./SourcesCorner";

type Props = {
  poll: MockPoll;
};

function tallyPercent(count: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((count / total) * 100);
}

export function PollCard({ poll }: Props) {
  const [expanded, setExpanded] = useState(false);
  const total = poll.options.reduce((sum, o) => sum + o.voteCount, 0);

  return (
    <article className="relative border-b border-[var(--line)] py-6 animate-[riseIn_420ms_ease-out]">
      <SourcesCorner sources={poll.sources} />

      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--accent)]">
        {poll.category}
      </p>

      <h2 className="max-w-[42rem] pr-16 font-[family-name:var(--font-display)] text-xl font-semibold leading-snug tracking-tight text-[var(--ink)] sm:text-2xl">
        {poll.question}
      </h2>

      <ul className="mt-5 flex max-w-xl flex-col gap-2">
        {poll.options.map((opt) => {
          const pct = tallyPercent(opt.voteCount, total);
          return (
            <li key={opt.id}>
              <button
                type="button"
                className="group relative w-full overflow-hidden rounded-md border border-[var(--line)] bg-[var(--paper-2)] px-3 py-2.5 text-left transition hover:border-[var(--ink)]/30"
                // TODO: wire vote API — requires verified email
                onClick={() => {
                  /* scaffold: no-op */
                }}
              >
                <span
                  className="pointer-events-none absolute inset-y-0 left-0 bg-[var(--accent-soft)] transition-[width] duration-500"
                  style={{ width: `${pct}%` }}
                  aria-hidden
                />
                <span className="relative flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-[var(--ink)]">{opt.label}</span>
                  <span className="tabular-nums text-[var(--muted)]">{pct}%</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-[var(--muted)]">
        <p>
          {poll.voteCount.toLocaleString()} votes · {poll.commentCount.toLocaleString()}{" "}
          comments
        </p>
        <button
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex items-center gap-1 font-medium text-[var(--ink)] transition hover:text-[var(--accent)]"
        >
          {expanded ? "Collapse" : "Expand"}
          <span
            className={`inline-block transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            aria-hidden
          >
            ▾
          </span>
        </button>
      </div>

      {expanded ? (
        <div className="mt-4 animate-[fadeIn_200ms_ease-out] rounded-md bg-[var(--paper-2)] p-4 ring-1 ring-[var(--line)]">
          <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--ink)]">
            Comments
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Fullscreen poll + comment thread UI lands next. Sign-in with verified
            email required to comment (one-level replies).
          </p>
          <div className="mt-4 space-y-3 opacity-60">
            <div className="h-3 w-3/4 rounded bg-[var(--line)]" />
            <div className="h-3 w-1/2 rounded bg-[var(--line)]" />
            <div className="h-3 w-2/3 rounded bg-[var(--line)]" />
          </div>
        </div>
      ) : null}
    </article>
  );
}
