"use client";

import type { FeedCategory } from "@/lib/mock-feed";
import { CATEGORIES } from "@/lib/mock-feed";

type Props = {
  active: FeedCategory;
  onChange: (category: FeedCategory) => void;
};

export function CategoryChips({ active, onChange }: Props) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
      aria-label="Poll categories"
    >
      {CATEGORIES.map((cat) => {
        const isActive = cat.id === active;
        return (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(cat.id)}
            className={
              isActive
                ? "shrink-0 border-b-2 border-[var(--accent)] px-1 py-2 font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--ink)] transition-colors"
                : "shrink-0 border-b-2 border-transparent px-1 py-2 font-[family-name:var(--font-display)] text-sm text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
            }
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
