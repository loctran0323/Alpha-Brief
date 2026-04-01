import type { WatchlistItem } from "@/types/database";
import { addTicker, removeTicker } from "@/app/dashboard/actions";
import { CURATED_LIQUID_TICKERS } from "@/lib/curated-tickers";

export function WatchlistPanel({
  watchlistId,
  items,
}: {
  watchlistId: string;
  items: WatchlistItem[];
}) {
  const owned = new Set(items.map((i) => i.ticker.toUpperCase()));
  const suggestions = CURATED_LIQUID_TICKERS.filter((t) => !owned.has(t));
  const sortedItems = [...items].sort((a, b) => a.ticker.localeCompare(b.ticker));

  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.02] p-3 sm:p-4">
      <div className="flex flex-wrap items-end gap-2">
        <form action={addTicker} className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          <input type="hidden" name="watchlist_id" value={watchlistId} />
          <label className="sr-only" htmlFor="watchlist-ticker-input">
            Ticker symbol
          </label>
          <input
            id="watchlist-ticker-input"
            name="ticker"
            placeholder="Ticker"
            maxLength={16}
            autoComplete="off"
            className="min-w-[6rem] max-w-[10rem] flex-1 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-1.5 font-mono text-xs text-white outline-none ring-[var(--accent)] focus:ring-1"
          />
          <button
            type="submit"
            className="shrink-0 rounded-md bg-[var(--accent)] px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[var(--accent-muted)]"
          >
            Add
          </button>
        </form>
      </div>

      <div className="mt-3 border-t border-white/10 pt-3">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">
            Your symbols
          </p>
          {sortedItems.length > 0 && (
            <span className="text-[10px] text-[var(--muted)]">{sortedItems.length}</span>
          )}
        </div>
        {sortedItems.length === 0 ? (
          <p className="text-xs text-[var(--muted)]">None yet — add a ticker above.</p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {sortedItems.map((item) => {
              const added = new Date(item.created_at).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              return (
                <form key={item.id} action={removeTicker} className="inline-flex">
                  <input type="hidden" name="item_id" value={item.id} />
                  <button
                    type="submit"
                    title={`Added ${added} — remove from watchlist`}
                    className="inline-flex items-center gap-0.5 rounded-md border border-white/12 bg-white/[0.06] py-0.5 pl-1.5 pr-1 font-mono text-[11px] font-semibold leading-none text-white transition hover:border-red-500/45 hover:bg-red-500/15"
                    aria-label={`Remove ${item.ticker} from watchlist`}
                  >
                    <span>{item.ticker}</span>
                    <span
                      className="flex h-4 w-4 items-center justify-center rounded text-[13px] font-normal text-[var(--muted)] hover:text-red-300"
                      aria-hidden
                    >
                      ×
                    </span>
                  </button>
                </form>
              );
            })}
          </div>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="mt-3 border-t border-dashed border-white/10 pt-3">
          <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-[var(--muted)]">
            Quick add
          </p>
          <div className="flex flex-wrap gap-1">
            {suggestions.map((t) => (
              <form key={t} action={addTicker} className="inline">
                <input type="hidden" name="watchlist_id" value={watchlistId} />
                <input type="hidden" name="ticker" value={t} />
                <button
                  type="submit"
                  className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white transition hover:border-[var(--accent)]/45 hover:bg-[var(--accent)]/10"
                >
                  +{t}
                </button>
              </form>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
