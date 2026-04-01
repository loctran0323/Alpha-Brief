import { NextResponse } from "next/server";
import { fetchYahooChartSnapshot } from "@/lib/market-map-data";

export const dynamic = "force-dynamic";

const MAX = 24;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("symbols") ?? "";
  const symbols = [
    ...new Set(
      raw
        .split(/[,\s]+/)
        .map((s) => s.trim().toUpperCase().replace(/[^A-Z0-9.-]/g, ""))
        .filter(Boolean),
    ),
  ].slice(0, MAX);

  if (symbols.length === 0) {
    return NextResponse.json({ quotes: [] });
  }

  const rows = await Promise.all(
    symbols.map(async (symbol) => {
      const snap = await fetchYahooChartSnapshot(symbol);
      return {
        symbol,
        shortName: snap?.shortName ?? symbol,
        price: snap?.price ?? null,
        changePct: snap?.changePct ?? 0,
      };
    }),
  );

  return NextResponse.json({ quotes: rows }, { headers: { "Cache-Control": "public, s-maxage=60" } });
}
