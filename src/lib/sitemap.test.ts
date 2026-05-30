import { describe, expect, it } from "vitest";
import { buildSitemapUrlXml, getSitemapUrls } from "./sitemap";
import type { DirectoryData } from "./types";

const directoryData: DirectoryData = {
  places: [
    {
      id: "place-1",
      slug: "mcdonalds-singapore-zoo",
      name: "McDonald's Singapore Zoo",
      address: "",
      phone: "",
      category: "Fast Food",
      streetName: "",
      postalCode: "",
      openingHours: "",
      certificationNumber: "",
      status: "MUIS Halal-certified",
      description: "",
      websiteUrl: "",
      facebookUrl: "",
      instagramUrl: "",
      googleMapsUrl: "",
      imageUrl: "",
      galleryImageUrl: "",
      featured: false,
      brands: [],
      neighbourhoods: [],
      malls: [],
      mrtStations: []
    }
  ],
  featuredPlaces: [],
  brands: [{ id: "brand-1", name: "McDonald's", slug: "mcdonalds", placeIds: ["place-1"], placeCount: 1 }],
  neighbourhoods: [{ id: "area-1", name: "Mandai", slug: "mandai", placeIds: ["place-1"], placeCount: 1 }],
  malls: [{ id: "mall-1", name: "Singapore Zoo", slug: "singapore-zoo", placeIds: ["place-1"], placeCount: 1 }],
  mrtStations: [{ id: "mrt-1", name: "Woodlands South MRT", slug: "woodlands-south-mrt", placeIds: ["place-1"], placeCount: 1 }],
  categories: ["Fast Food"]
};

describe("sitemap", () => {
  it("lists indexable site URLs and excludes search and 404 pages", () => {
    const urls = getSitemapUrls(directoryData);

    expect(urls).toContain("https://halalcrowd.sg/");
    expect(urls).toContain("https://halalcrowd.sg/halal-food-places/mcdonalds-singapore-zoo/");
    expect(urls).toContain("https://halalcrowd.sg/brands/mcdonalds/");
    expect(urls).not.toContain("https://halalcrowd.sg/search/");
    expect(urls).not.toContain("https://halalcrowd.sg/404/");
  });

  it("generates a URL sitemap document, not HTML", () => {
    const sitemap = buildSitemapUrlXml(["https://halalcrowd.sg/"]);

    expect(sitemap).toContain("<urlset");
    expect(sitemap).toContain("<url><loc>https://halalcrowd.sg/</loc></url>");
    expect(sitemap).not.toContain("<html");
  });
});
