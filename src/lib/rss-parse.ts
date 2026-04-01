/** Minimal RSS item parsing shared by news and online timeline. */

export function rssGetTag(input: string, tag: string): string {
  const m = input.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i"));
  if (!m) return "";
  return m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
}

export function rssFirstItem(xml: string): {
  title: string;
  link: string;
  pubDate: string;
} | null {
  const block = xml.match(/<item>([\s\S]*?)<\/item>/i)?.[0];
  if (!block) return null;
  const title = rssGetTag(block, "title").replace(/<[^>]+>/g, "").trim();
  let link = rssGetTag(block, "link").trim();
  if (!link) {
    const guid = rssGetTag(block, "guid").trim();
    if (guid.startsWith("http")) link = guid;
  }
  const pubDate = rssGetTag(block, "pubDate").trim();
  if (!title || !link) return null;
  return { title, link, pubDate: pubDate || new Date().toISOString() };
}
