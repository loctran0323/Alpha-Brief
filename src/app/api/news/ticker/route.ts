import { getNewsForTicker } from "@/lib/news";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");
  if (!symbol || !symbol.trim()) {
    return NextResponse.json({ error: "symbol is required" }, { status: 400 });
  }

  const articles = await getNewsForTicker(symbol.trim(), 10);
  return NextResponse.json({ articles });
}
