import { describe, expect, it } from "vitest";
import { ENTITY_PAGE_CONFIGS } from "./entity-pages";

describe("ENTITY_PAGE_CONFIGS", () => {
  it("defines collection index pages for every entity type", () => {
    expect(Object.keys(ENTITY_PAGE_CONFIGS)).toEqual(["brands", "neighbourhoods", "malls", "mrtStations"]);
    expect(ENTITY_PAGE_CONFIGS.brands.basePath).toBe("/brands");
    expect(ENTITY_PAGE_CONFIGS.neighbourhoods.basePath).toBe("/neighbourhoods");
    expect(ENTITY_PAGE_CONFIGS.malls.basePath).toBe("/malls");
    expect(ENTITY_PAGE_CONFIGS.mrtStations.basePath).toBe("/mrt-stations");
  });
});
