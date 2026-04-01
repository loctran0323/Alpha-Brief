import Link from "next/link";
import { MarketMapExplorer } from "@/components/market-map-explorer";
import { fetchMarketMapTree } from "@/lib/market-map-data";

export default async function ExploreMapPage() {
  const tree = await fetchMarketMapTree();
  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--muted)]">
        Same map as signed-in users.{" "}
        <Link href="/signup" className="text-[var(--accent)] hover:underline">
          Sign up
        </Link>{" "}
        to save a watchlist on your dashboard.
      </p>
      <MarketMapExplorer tree={tree} />
    </div>
  );
}
