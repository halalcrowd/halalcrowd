import { ENTITY_PAGE_CONFIGS } from "./entity-pages";
import type { DirectoryData } from "./types";

export const SITE_URL = "https://halalcrowd.sg";
export const SITEMAP_INDEX_PATH = "/sitemap-index.xml";
export const SITEMAP_URLS_PATH = "/sitemap-0.xml";

const xml = (value: string): string => {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
};

const absoluteUrl = (path: string): string => {
  return new URL(path, SITE_URL).href;
};

export const getSitemapUrls = (data: DirectoryData): string[] => {
  const urls = [
    "/",
    "/directory/",
    "/brands/",
    "/neighbourhoods/",
    "/malls/",
    "/mrt-stations/",
    ...data.places.map((place) => `/halal-food-places/${place.slug}/`),
    ...ENTITY_PAGE_CONFIGS.brands.getEntities(data).map((entity) => `${ENTITY_PAGE_CONFIGS.brands.basePath}/${entity.slug}/`),
    ...ENTITY_PAGE_CONFIGS.neighbourhoods.getEntities(data).map((entity) => `${ENTITY_PAGE_CONFIGS.neighbourhoods.basePath}/${entity.slug}/`),
    ...ENTITY_PAGE_CONFIGS.malls.getEntities(data).map((entity) => `${ENTITY_PAGE_CONFIGS.malls.basePath}/${entity.slug}/`),
    ...ENTITY_PAGE_CONFIGS.mrtStations.getEntities(data).map((entity) => `${ENTITY_PAGE_CONFIGS.mrtStations.basePath}/${entity.slug}/`)
  ];

  return Array.from(new Set(urls.map(absoluteUrl))).sort((a, b) => a.localeCompare(b));
};

export const buildSitemapIndexXml = (): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    `<sitemap><loc>${xml(absoluteUrl(SITEMAP_URLS_PATH))}</loc></sitemap>` +
    `</sitemapindex>`;
};

export const buildSitemapUrlXml = (urls: string[]): string => {
  const entries = urls.map((url) => `<url><loc>${xml(url)}</loc></url>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    entries +
    `</urlset>`;
};

export const sitemapHeaders = {
  "Content-Type": "application/xml; charset=utf-8"
};
