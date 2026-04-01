"use client";

import { useMemo, useState } from "react";
import type { MarketEvent, WatchlistItem } from "@/types/database";
import { TimelinePager } from "@/components/timeline-pager";
import { filterUpcomingMarketEvents } from "@/lib/timeline-upcoming";

function splitTimeline(events: MarketEvent[]) {
  const macro = events.filter((e) => e.ticker == null || String(e.ticker).trim() === "");
  const ticker = events.filter((e) => e.ticker != null && String(e.ticker).trim() !== "");
  return { macro, ticker };
}

export function DashboardTimelineTabs({
  events,
  watchlistItems,
  perPage = 2,
}: {
  events: MarketEvent[];
  watchlistItems: WatchlistItem[];
  perPage?: number;
}) {
  const [tab, setTab] = useState<"macro" | "ticker">("macro");

  const upcoming = useMemo(() => filterUpcomingMarketEvents(events), [events]);
  const { macro, ticker } = useMemo(() => splitTimeline(upcoming), [upcoming]);

  const sortedTickers = useMemo(
    () => [...watchlistItems].sort((a, b) => a.ticker.localeCompare(b.ticker)),
    [watchlistItems],
  );

  const activeEvents = tab === "macro" ? macro : ticker;

  const emptyMessage =
    activeEvents.length === 0
      ? tab === "macro"
        ? "No macro or economy-wide events in the window yet. Refresh after adding rows in Supabase or when the calendar rolls forward."
        : "No watchlist-tied events yet. Add tickers in Watchlist and create `market_events` rows with those symbols."
      : undefined;

  return (
    <TimelinePager
      events={activeEvents}
      perPage={perPage}
      showTickerOnCards={tab === "ticker"}
      emptyMessage={emptyMessage}
      header={
        <>
          <h2 className="text-lg font-semibold text-white">Timeline</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTab("macro")}
              className={
                tab === "macro"
                  ? "rounded-full bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white"
                  : "rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-[var(--muted)] ring-1 ring-white/10 hover:text-white"
              }
            >
              Macro ({macro.length})
            </button>
            <button
              type="button"
              onClick={() => setTab("ticker")}
              className={
                tab === "ticker"
                  ? "rounded-full bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white"
                  : "rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-[var(--muted)] ring-1 ring-white/10 hover:text-white"
              }
            >
              Tickers ({ticker.length})
            </button>
          </div>
          {tab === "ticker" && (
            <div className="mt-3">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted)]">
                Your watchlist (sorted)
              </p>
              {sortedTickers.length === 0 ? (
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Add symbols in Watchlist above to see ticker tags and company events here.
                </p>
              ) : (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {sortedTickers.map((item) => (
                    <li
                      key={item.id}
                      className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold tracking-tight text-white ring-1 ring-white/10"
                    >
                      <span className="font-mono">{item.ticker}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      }
    />
  );
}
