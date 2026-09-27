import Link from "next/link";

/**
 * Sign-in shell — Google + email/password ready via Auth.js.
 * Credentials authorize() is stubbed until DB + bcrypt are wired.
 */
export default function SignInPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-[var(--ink)]">
        Sign in
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        A verified email is required before you can vote or comment. No guest
        voting.
      </p>

      <div className="mt-8 flex flex-col gap-3">
        <form
          action="/api/auth/signin/google"
          method="POST"
          className="contents"
        >
          {/* Auth.js CSRF is required in production; this is a scaffold affordance */}
          <button
            type="submit"
            className="w-full border border-[var(--ink)] bg-[var(--ink)] px-4 py-2.5 text-sm font-medium text-[var(--paper)] transition hover:bg-transparent hover:text-[var(--ink)]"
          >
            Continue with Google
          </button>
        </form>

        <div className="relative my-2 text-center text-xs text-[var(--muted)]">
          <span className="bg-[var(--paper)] px-2">or email</span>
          <span className="absolute inset-x-0 top-1/2 -z-10 h-px bg-[var(--line)]" />
        </div>

        <form className="flex flex-col gap-3" action="#" method="post">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-[var(--muted)]">Email</span>
            <input
              type="email"
              name="email"
              required
              className="border border-[var(--line)] bg-[var(--paper-2)] px-3 py-2 text-[var(--ink)] outline-none focus:border-[var(--ink)]"
              placeholder="you@example.com"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-[var(--muted)]">Password</span>
            <input
              type="password"
              name="password"
              required
              className="border border-[var(--line)] bg-[var(--paper-2)] px-3 py-2 text-[var(--ink)] outline-none focus:border-[var(--ink)]"
              placeholder="••••••••"
            />
          </label>
          <button
            type="submit"
            disabled
            title="Wire credentials authorize() + email verification next"
            className="w-full border border-[var(--line)] px-4 py-2.5 text-sm font-medium text-[var(--muted)]"
          >
            Email sign-in (coming soon)
          </button>
        </form>
      </div>

      <p className="mt-8 text-center text-sm text-[var(--muted)]">
        <Link href="/" className="underline-offset-2 hover:underline">
          ← Back to feed
        </Link>
      </p>
    </div>
  );
}
