"use client";

import { useMemo, useState, useTransition } from "react";
import type { FeedCategory } from "@/lib/mock-feed";
import { MOCK_POLLS } from "@/lib/mock-feed";
import { CategoryChips } from "./CategoryChips";
import { PollCard } from "./PollCard";

/**
 * Empty / mock trending feed shell:
 * infinite list placeholder, category chips, poll cards with
 * source corner + expand control.
 */
export function FeedShell() {
  const [category, setCategory] = useState<FeedCategory>("all");
  const [visible, setVisible] = useState(4);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(() => {
    const base =
      category === "all"
        ? MOCK_POLLS
        : MOCK_POLLS.filter((p) => p.category === category);
    // Repeat mock items to simulate a longer feed for the infinite shell
    const extended = [...base, ...base.map((p) => ({ ...p, id: `${p.id}-b` }))];
    return extended;
  }, [category]);

  const items = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  return (
    <section className="mx-auto w-full max-w-2xl px-4 pb-24 pt-6 sm:px-6">
      <header className="mb-6">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
          Trending
        </h1>
        <p className="mt-1 max-w-md text-sm text-[var(--muted)]">
          News-driven polls — vote and argue on stories with sustained coverage.
        </p>
      </header>

      <div className="sticky top-0 z-20 -mx-4 border-b border-[var(--line)] bg-[var(--paper)]/95 px-4 backdrop-blur sm:-mx-6 sm:px-6">
        <CategoryChips
          active={category}
          onChange={(c) => {
            startTransition(() => {
              setCategory(c);
              setVisible(4);
            });
          }}
        />
      </div>

      <div className={isPending ? "opacity-60 transition-opacity" : ""}>
        {items.length === 0 ? (
          <p className="py-16 text-center text-sm text-[var(--muted)]">
            No polls in this category yet.
          </p>
        ) : (
          items.map((poll) => <PollCard key={poll.id} poll={poll} />)
        )}
      </div>

      {hasMore ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((n) => n + 4)}
            className="border border-[var(--ink)] bg-[var(--ink)] px-5 py-2.5 text-sm font-medium text-[var(--paper)] transition hover:bg-transparent hover:text-[var(--ink)]"
          >
            Load more
          </button>
        </div>
      ) : (
        <p className="mt-10 text-center text-xs text-[var(--muted)]">
          End of mock feed — live trending API TODO.
        </p>
      )}
    </section>
  );
}
