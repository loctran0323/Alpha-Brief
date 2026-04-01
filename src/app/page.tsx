import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/env";

const features = [
  {
    title: "Watchlist-first",
    body:
      "Your symbols control which company-specific headlines and timeline rows appear. Add or remove tickers in a compact strip — no clutter.",
  },
  {
    title: "Upcoming timeline",
    body:
      "See what’s ahead, not what’s past: macro prints (CPI, Fed, housing, and more) on one tab, watchlist-tied events on another. Pulls from your calendar data plus a rolling macro schedule.",
  },
  {
    title: "News briefing",
    body:
      "Headlines from public RSS feeds: All merges broad and watchlist stories; Tickers isolates your symbols; topic tabs cover the rest. Every item gets a short summary plus a bullish, bearish, or neutral read with rationale.",
  },
  {
    title: "Fresh by design",
    body:
      "Stories older than seven days drop off automatically. While you’re on the dashboard, data refetches on a timer — about every fifteen minutes — so feeds stay current without manual refresh.",
  },
  {
    title: "Market map",
    body:
      "After you sign in, open Map for a sector → industry view of large-cap names with recent price change — a quick way to scan the tape by theme.",
  },
  {
    title: "Optional email digest",
    body:
      "In Settings, choose daily or weekly digests when your project has email (Resend) configured — plus a test send to verify your inbox.",
  },
] as const;

export default function HomePage() {
  const configured = isSupabaseConfigured();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a2332_0%,_transparent_55%)]" />
      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-8">
        <span className="text-lg font-semibold tracking-tight text-white">Catalyst</span>
        <nav className="flex items-center gap-4 text-sm">
          {configured ? (
            <>
              <Link
                href="/login"
                className="text-[var(--muted)] transition hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-[var(--accent)] px-4 py-2 font-medium text-white transition hover:bg-[var(--accent-muted)]"
              >
                Get started
              </Link>
            </>
          ) : (
            <span className="max-w-[220px] text-right text-xs leading-snug text-amber-400/90 sm:max-w-none">
              Sign-in needs backend keys in{" "}
              <code className="text-amber-200/90">.env.local</code>
            </span>
          )}
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-8 md:pt-14">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-[var(--accent)]">
            Watchlist · timeline · news
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-white md:text-5xl">
            One dashboard for what’s next in the market — tuned to your tickers
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-[var(--muted)]">
            Catalyst combines an{" "}
            <span className="text-[var(--foreground)]">upcoming-event timeline</span>, a{" "}
            <span className="text-[var(--foreground)]">news briefing</span> from major RSS sources, and a{" "}
            <span className="text-[var(--foreground)]">sector map</span> so you can scan macro dates, headlines, and
            large-cap moves without living in a trading terminal. Built for retail investors who want context, not noise.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {configured ? (
              <Link
                href="/signup"
                className="rounded-xl bg-[var(--accent)] px-8 py-3 text-base font-medium text-white shadow-lg shadow-blue-500/20 transition hover:bg-[var(--accent-muted)]"
              >
                Create free account
              </Link>
            ) : (
              <span className="rounded-xl border border-[var(--border)] px-8 py-3 text-base text-[var(--muted)]">
                Connect the app backend first (see .env.example)
              </span>
            )}
            <Link
              href={configured ? "/login" : "#"}
              className={
                configured
                  ? "text-sm font-medium text-[var(--muted)] underline-offset-4 hover:text-white hover:underline"
                  : "cursor-not-allowed text-sm text-[var(--muted)]/50"
              }
            >
              I already have an account
            </Link>
          </div>
        </div>

        <ul className="mx-auto mt-16 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <li
              key={f.title}
              className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 text-left"
            >
              <h3 className="font-medium text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{f.body}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
