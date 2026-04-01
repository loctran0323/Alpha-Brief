import Link from "next/link";

export function AppNav({ email }: { email?: string }) {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/dashboard" className="text-lg font-semibold text-white">
          Catalyst
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/dashboard"
            className="text-[var(--muted)] transition hover:text-white"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/map"
            className="text-[var(--muted)] transition hover:text-white"
          >
            Map
          </Link>
          <Link
            href="/dashboard/settings"
            className="text-[var(--muted)] transition hover:text-white"
          >
            Settings
          </Link>
          {email && (
            <span className="hidden text-[var(--muted)] sm:inline">{email}</span>
          )}
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="text-[var(--muted)] transition hover:text-white"
            >
              Sign out
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
