import { buildSitemapIndexXml, sitemapHeaders } from "../lib/sitemap";

export function GET() {
  return new Response(buildSitemapIndexXml(), {
    headers: sitemapHeaders
  });
}
