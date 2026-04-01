import type { SupabaseClient } from "@supabase/supabase-js";
import type { MarketEvent } from "@/types/database";
import { getSyntheticMacroTimeline, mergeTimelineEvents } from "@/lib/macro-timeline";
import { fetchOnlineTickerTimelineEvents } from "@/lib/online-ticker-events";
import { filterUpcomingMarketEvents } from "@/lib/timeline-upcoming";

export { filterUpcomingMarketEvents };

export async function fetchDashboardEvents(
  supabase: SupabaseClient,
  watchlistTickers: string[],
): Promise<MarketEvent[]> {
  const upper = [...new Set(watchlistTickers.map((t) => t.trim().toUpperCase()))].filter(
    Boolean,
  );

  const { data: macro, error: e1 } = await supabase
    .from("market_events")
    .select("*")
    .is("ticker", null)
    .order("event_date", { ascending: true });

  if (e1) throw e1;

  let byTicker: MarketEvent[] = [];
  if (upper.length > 0) {
    const { data, error: e2 } = await supabase
      .from("market_events")
      .select("*")
      .in("ticker", upper)
      .order("event_date", { ascending: true });
    if (e2) throw e2;
    byTicker = (data ?? []) as MarketEvent[];
  }

  const merged = new Map<string, MarketEvent>();
  for (const e of [...(macro ?? []), ...byTicker] as MarketEvent[]) {
    merged.set(e.id, e);
  }
  const sorted = [...merged.values()].sort(
    (a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime(),
  );
  return filterUpcomingMarketEvents(sorted);
}

/** DB watchlist + macro events merged with a rolling synthetic macro/housing calendar. */
export async function fetchMergedDashboardEvents(
  supabase: SupabaseClient,
  watchlistTickers: string[],
): Promise<MarketEvent[]> {
  const dbEvents = await fetchDashboardEvents(supabase, watchlistTickers);
  const synthetic = getSyntheticMacroTimeline();
  let online: MarketEvent[] = [];
  try {
    online = await fetchOnlineTickerTimelineEvents(watchlistTickers);
  } catch {
    online = [];
  }
  const withMacro = mergeTimelineEvents(dbEvents, synthetic);
  const merged = mergeTimelineEvents(withMacro, online);
  return filterUpcomingMarketEvents(merged);
}

/** Public / guest: rolling synthetic macro calendar only (anon users cannot read `market_events`). */
export function getGuestTimelineEvents(): MarketEvent[] {
  return filterUpcomingMarketEvents(getSyntheticMacroTimeline());
}
