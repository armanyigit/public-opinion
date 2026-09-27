"use client";

import { useId, useState } from "react";
import type { MockSource } from "@/lib/mock-feed";

type Props = {
  sources: MockSource[];
};

export function SourcesCorner({ sources }: Props) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="absolute right-3 top-3 z-10">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Sources (${sources.length})`}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-sm bg-[var(--paper)]/90 px-2 py-1 text-xs font-medium text-[var(--ink)] shadow-sm ring-1 ring-[var(--line)] backdrop-blur transition hover:ring-[var(--accent)]"
      >
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-sm bg-[var(--ink)] text-[10px] font-bold text-[var(--paper)]">
          {sources.length}
        </span>
        <span className="hidden sm:inline">Sources</span>
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="Poll sources"
          className="absolute right-0 top-full mt-2 w-72 origin-top-right animate-[fadeIn_160ms_ease-out] rounded-md bg-[var(--paper)] p-3 shadow-lg ring-1 ring-[var(--line)]"
        >
          <p className="mb-2 font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
            Sources
          </p>
          <ul className="flex flex-col gap-3">
            {sources.map((s) => (
              <li key={s.id} className="text-sm">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[var(--ink)] underline-offset-2 hover:underline"
                >
                  {s.title}
                </a>
                <p className="mt-0.5 text-xs text-[var(--muted)]">
                  {s.publisher}
                  {s.publishedAt
                    ? ` · ${new Date(s.publishedAt).toLocaleDateString()}`
                    : null}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[10px] leading-snug text-[var(--muted)]">
            Link-out citations only — article bodies are never stored or shown
            in-app.
          </p>
        </div>
      ) : null}
    </div>
  );
}
