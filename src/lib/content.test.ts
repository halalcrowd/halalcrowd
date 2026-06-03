import { describe, expect, it } from "vitest";
import { normalizeDirectoryData } from "./content";
import type { AirtableRecord, RawDirectoryData } from "./types";

const record = (id: string, fields: Record<string, unknown>): AirtableRecord => ({
  id,
  createdTime: "2026-05-30T00:00:00.000Z",
  fields
});

const rawData: RawDirectoryData = {
  foodPlaces: [
    record("recPlaceActive", {
      fldgcSF6Fx6mmWzu2: "McDonald's Singapore Zoo",
      fldOo8LvtYfSDkjfz: "mcdonalds-singapore-zoo",
      fldzBH7Zk80AYQiZX: [{ id: "recBrandMcD", name: "McDonald's" }],
      fldLa5ewVJEvNuesO: ["recNeighbourhoodMandai"],
      fldkBtytmhdwcHQLh: [{ id: "recMallZoo", name: "Singapore Zoo" }],
      fldFzC5orRtujErco: ["recMrtKhatib"],
      fldZ3PTfN6IpqjpEk: "Fast Food",
      fldbfWcWb6TI05bfJ: { name: "MUIS Halal-certified" },
      fld4KizsgKnBP2utQ: " https://www.mcdonalds.com.sg ",
      fldBMHLY2uXhsN4fF: "https://example.com/zoo.jpg",
      fldaxulW34UhrK764: true
    }),
    record("recPlaceInactive", {
      fldgcSF6Fx6mmWzu2: "Hidden Outlet",
      fldOo8LvtYfSDkjfz: "hidden-outlet",
      fldbfWcWb6TI05bfJ: ""
    })
  ],
  brands: [
    record("recBrandMcD", {
      fldoRlPEiUzBtv1io: "McDonald's",
      fldPbXwr7jP6eIyH7: "mcdonalds-sg",
      fldt170QMF1Ns36GE: ["recPlaceActive"]
    })
  ],
  neighbourhoods: [
    record("recNeighbourhoodMandai", {
      fld3NrLuamdOa6g3T: "Mandai",
      fldxvjwCbGtllzfro: "mandai-estate",
      fldqJICPnDsS9VXWD: ["recPlaceActive"]
    })
  ],
  malls: [
    record("recMallZoo", {
      fld3f636Scz9U8FGu: "Singapore Zoo",
      fldJgc4DNoNxj8Vaj: "singapore-zoo-location",
      fldZOmnp6zlSMcKF6: ["recPlaceActive"]
    })
  ],
  mrtStations: [
    record("recMrtKhatib", {
      fldvgCAt1Exb33CpN: "Khatib MRT",
      fldIuz0UqN72QCGow: "khatib-station",
      fldSLUpt1XSjM2kiK: ["recPlaceActive"]
    })
  ]
};

describe("normalizeDirectoryData", () => {
  it("keeps only active places and trims external URLs", () => {
    const directory = normalizeDirectoryData(rawData);

    expect(directory.places).toHaveLength(1);
    expect(directory.places[0].name).toBe("McDonald's Singapore Zoo");
    expect(directory.places[0].websiteUrl).toBe("https://www.mcdonalds.com.sg");
    expect(directory.places[0].imageUrl).toBe("https://example.com/zoo.jpg");
  });

  it("accepts the Food Places Image URL field by name when field IDs are unavailable", () => {
    const directory = normalizeDirectoryData({
      ...rawData,
      foodPlaces: [
        record("recNamedImageField", {
          fldgcSF6Fx6mmWzu2: "Named Image Outlet",
          fldOo8LvtYfSDkjfz: "named-image-outlet",
          fldbfWcWb6TI05bfJ: "MUIS Halal-certified",
          "Image URL": "https://example.com/named-image.jpg"
        })
      ]
    });

    expect(directory.places[0].imageUrl).toBe("https://example.com/named-image.jpg");
  });

  it("trims explicit Food Places slugs from Airtable", () => {
    const directory = normalizeDirectoryData({
      ...rawData,
      foodPlaces: [
        record("recPlaceWithSpacedSlug", {
          fldgcSF6Fx6mmWzu2: "Pizza Hut 126C Tengah Drive",
          fldOo8LvtYfSDkjfz: "Pizza-hut-left-126C-Tengah-Drive ",
          fldbfWcWb6TI05bfJ: "MUIS Halal-certified"
        })
      ]
    });

    expect(directory.places[0].slug).toBe("Pizza-hut-left-126C-Tengah-Drive");
  });

  it("resolves linked record names from inline values and lookup tables", () => {
    const directory = normalizeDirectoryData(rawData);
    const place = directory.places[0];

    expect(place.brands[0]).toMatchObject({ id: "recBrandMcD", name: "McDonald's", slug: "mcdonalds-sg" });
    expect(place.neighbourhoods[0]).toMatchObject({
      id: "recNeighbourhoodMandai",
      name: "Mandai",
      slug: "mandai-estate"
    });
    expect(place.malls[0]).toMatchObject({
      id: "recMallZoo",
      name: "Singapore Zoo",
      slug: "singapore-zoo-location"
    });
    expect(place.mrtStations[0]).toMatchObject({ id: "recMrtKhatib", name: "Khatib MRT", slug: "khatib-station" });
  });

  it("resolves text location fields to entity pages and counts active outlets", () => {
    const directory = normalizeDirectoryData({
      ...rawData,
      foodPlaces: [
        record("recTextLocationPlace", {
          fldgcSF6Fx6mmWzu2: "Text Location Outlet",
          fldOo8LvtYfSDkjfz: "text-location-outlet",
          fldLa5ewVJEvNuesO: "Mandai",
          fldkBtytmhdwcHQLh: "Singapore Zoo",
          fldFzC5orRtujErco: "Khatib MRT",
          fldbfWcWb6TI05bfJ: "MUIS Halal-certified"
        })
      ]
    });
    const place = directory.places[0];

    expect(place.neighbourhoods[0]).toMatchObject({
      id: "recNeighbourhoodMandai",
      name: "Mandai",
      slug: "mandai-estate"
    });
    expect(place.malls[0]).toMatchObject({
      id: "recMallZoo",
      name: "Singapore Zoo",
      slug: "singapore-zoo-location"
    });
    expect(place.mrtStations[0]).toMatchObject({ id: "recMrtKhatib", name: "Khatib MRT", slug: "khatib-station" });
    expect(directory.neighbourhoods[0].placeCount).toBe(1);
    expect(directory.malls[0].placeCount).toBe(1);
    expect(directory.mrtStations[0].placeCount).toBe(1);
  });

  it("counts active outlets for entities and exposes featured places", () => {
    const directory = normalizeDirectoryData(rawData);

    expect(directory.featuredPlaces).toHaveLength(1);
    expect(directory.brands[0].placeCount).toBe(1);
    expect(directory.neighbourhoods[0].placeCount).toBe(1);
  });
});
