import { MarketMapExplorer } from "@/components/market-map-explorer";
import { fetchMarketMapTree } from "@/lib/market-map-data";

export default async function MarketMapPage() {
  const tree = await fetchMarketMapTree();
  return <MarketMapExplorer tree={tree} />;
}
