import { buildSitemapIndexXml, SITEMAP_URLS_PATH, SITE_URL, sitemapHeaders } from "../lib/sitemap";

export async function GET() {
  return new Response(buildSitemapIndexXml([new URL(SITEMAP_URLS_PATH, SITE_URL).href]), {
    headers: sitemapHeaders
  });
}
