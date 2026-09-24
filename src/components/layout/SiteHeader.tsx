import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-[var(--line)] bg-[var(--paper)]/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-[var(--ink)]"
        >
          Public Opinion
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link
            href="/auth/signin"
            className="text-[var(--muted)] transition hover:text-[var(--ink)]"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
