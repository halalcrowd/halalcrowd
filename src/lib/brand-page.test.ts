import { describe, expect, it } from "vitest";
import { getBrandPageProfile } from "./brand-page";
import type { DirectoryEntity, FoodPlace } from "./types";

const brand: DirectoryEntity = {
  id: "brand-1",
  name: "KFC",
  slug: "kfc",
  description: "",
  placeIds: ["place-1", "place-2", "place-3"],
  placeCount: 3
};

const place = (overrides: Partial<FoodPlace>): FoodPlace => ({
  id: "place-1",
  slug: "kfc-test",
  name: "KFC Test",
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
  imageUrl: "https://example.com/kfc.jpg",
  galleryImageUrl: "",
  featured: false,
  brands: [{ id: "brand-1", name: "KFC", slug: "kfc" }],
  neighbourhoods: [{ id: "area-1", name: "Tampines", slug: "tampines" }],
  malls: [{ id: "mall-1", name: "Tampines Mall", slug: "tampines-mall" }],
  mrtStations: [],
  ...overrides
});

describe("getBrandPageProfile", () => {
  it("builds compact brand facts for the profile layout", () => {
    const profile = getBrandPageProfile(brand, [
      place({ id: "place-1", imageUrl: "https://example.com/lead.jpg", category: "Fast Food" }),
      place({
        id: "place-2",
        category: "Western",
        neighbourhoods: [{ id: "area-1", name: "Tampines", slug: "tampines" }]
      }),
      place({
        id: "place-3",
        status: "",
        category: "Fast Food",
        neighbourhoods: [{ id: "area-2", name: "Woodlands", slug: "woodlands" }],
        malls: [{ id: "mall-2", name: "Causeway Point", slug: "causeway-point" }]
      })
    ]);

    expect(profile.heroImageUrl).toBe("https://example.com/lead.jpg");
    expect(profile.statusLabel).toBe("MUIS Halal-certified");
    expect(profile.categories).toEqual(["Fast Food", "Western"]);
    expect(profile.popularAreas).toEqual([
      { id: "area-1", name: "Tampines", slug: "tampines", count: 2 },
      { id: "area-2", name: "Woodlands", slug: "woodlands", count: 1 }
    ]);
    expect(profile.popularMalls).toEqual([
      { id: "mall-1", name: "Tampines Mall", slug: "tampines-mall", count: 2 },
      { id: "mall-2", name: "Causeway Point", slug: "causeway-point", count: 1 }
    ]);
  });
});
