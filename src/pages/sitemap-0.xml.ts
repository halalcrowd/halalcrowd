import { getDirectoryData } from "../lib/airtable";
import { buildSitemapUrlXml, getSitemapUrls, sitemapHeaders } from "../lib/sitemap";

export async function GET() {
  const data = await getDirectoryData();
  return new Response(buildSitemapUrlXml(getSitemapUrls(data)), {
    headers: sitemapHeaders
  });
}
