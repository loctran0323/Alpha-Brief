import { fetchYahooChartSnapshot, YAHOO_UA } from "@/lib/market-map-data";

export type MarketMover = {
  symbol: string;
  name: string;
  price: number | null;
  changePct: number;
  volume?: number;
};

export type BenchmarkQuote = {
  label: string;
  symbol: string;
  price: number | null;
  changePct: number;
};

export type MarketHomeData = {
  gainers: MarketMover[];
  losers: MarketMover[];
  mostActives: MarketMover[];
  largestByCap: MarketMover[];
  benchmarks: BenchmarkQuote[];
};

type YahooScreenerQuote = {
  symbol?: string;
  shortName?: string;
  regularMarketPrice?: number;
  regularMarketChangePercent?: number;
  regularMarketVolume?: number;
};

const BENCHMARKS: { label: string; symbol: string }[] = [
  { label: "S&P 500", symbol: "SPY" },
  { label: "Nasdaq 100", symbol: "QQQ" },
  { label: "Russell 2000", symbol: "IWM" },
  { label: "Dow", symbol: "DIA" },
  { label: "Total US market", symbol: "VTI" },
  { label: "S&P 500 index", symbol: "^GSPC" },
  { label: "Nasdaq Composite", symbol: "^IXIC" },
  { label: "Emerging markets", symbol: "EEM" },
];

async function fetchYahooScreener(scrId: string, count: number): Promise<MarketMover[]> {
  const url = `https://query1.finance.yahoo.com/v1/finance/screener/predefined/saved?count=${count}&scrIds=${encodeURIComponent(scrId)}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": YAHOO_UA, Accept: "application/json" },
      next: { revalidate: 120 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as {
      finance?: { result?: { quotes?: YahooScreenerQuote[] }[]; error?: unknown };
    };
    if (json.finance?.error) return [];
    const quotes = json.finance?.result?.[0]?.quotes;
    if (!Array.isArray(quotes)) return [];
    const out: MarketMover[] = [];
    for (const q of quotes) {
      const symbol = typeof q.symbol === "string" ? q.symbol.trim() : "";
      if (!symbol) continue;
      const name = (typeof q.shortName === "string" && q.shortName.trim()) || symbol;
      out.push({
        symbol,
        name,
        price: typeof q.regularMarketPrice === "number" ? q.regularMarketPrice : null,
        changePct:
          typeof q.regularMarketChangePercent === "number" ? q.regularMarketChangePercent : 0,
        volume:
          typeof q.regularMarketVolume === "number" && q.regularMarketVolume > 0
            ? q.regularMarketVolume
            : undefined,
      });
    }
    return out;
  } catch {
    return [];
  }
}

export async function fetchMarketHomeData(): Promise<MarketHomeData> {
  const [gainers, losers, mostActives, largestByCap, benchmarkSnaps] = await Promise.all([
    fetchYahooScreener("day_gainers", 15),
    fetchYahooScreener("day_losers", 15),
    fetchYahooScreener("most_actives", 12),
    fetchYahooScreener("largest_market_cap", 12),
    Promise.all(
      BENCHMARKS.map(async (b) => {
        const snap = await fetchYahooChartSnapshot(b.symbol);
        return {
          label: b.label,
          symbol: b.symbol,
          price: snap?.price ?? null,
          changePct: snap?.changePct ?? 0,
        } satisfies BenchmarkQuote;
      }),
    ),
  ]);

  return {
    gainers,
    losers,
    mostActives,
    largestByCap,
    benchmarks: benchmarkSnaps,
  };
}
