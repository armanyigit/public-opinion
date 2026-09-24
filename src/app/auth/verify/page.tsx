import Link from "next/link";

export default function VerifyPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16 text-center">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--ink)]">
        Check your email
      </h1>
      <p className="mt-3 text-sm text-[var(--muted)]">
        Verify your address to unlock voting and commenting. Unverified accounts
        can browse the feed only.
      </p>
      <Link
        href="/"
        className="mt-8 text-sm font-medium text-[var(--ink)] underline-offset-2 hover:underline"
      >
        Back to feed
      </Link>
    </div>
  );
}
