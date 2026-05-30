import type { DirectoryData, DirectoryEntity } from "./types";

export type EntityCollectionKey = "brands" | "neighbourhoods" | "malls" | "mrtStations";

export interface EntityPageConfig {
  key: EntityCollectionKey;
  basePath: string;
  eyebrow: string;
  title: string;
  description: string;
  countLabel: string;
  emptyMessage: string;
  getEntities: (data: DirectoryData) => DirectoryEntity[];
}

export const ENTITY_PAGE_CONFIGS = {
  brands: {
    key: "brands",
    basePath: "/brands",
    eyebrow: "Brands",
    title: "Halal Food Brands",
    description: "Browse halal food places by brand across Singapore.",
    countLabel: "brands",
    emptyMessage: "No brand pages are available yet.",
    getEntities: (data) => data.brands
  },
  neighbourhoods: {
    key: "neighbourhoods",
    basePath: "/neighbourhoods",
    eyebrow: "Neighbourhoods",
    title: "Halal Food By Neighbourhood",
    description: "Browse halal food places by neighbourhood across Singapore.",
    countLabel: "neighbourhoods",
    emptyMessage: "No neighbourhood pages are available yet.",
    getEntities: (data) => data.neighbourhoods
  },
  malls: {
    key: "malls",
    basePath: "/malls",
    eyebrow: "Malls / Locations",
    title: "Halal Food By Mall",
    description: "Browse halal food places by mall and location across Singapore.",
    countLabel: "malls and locations",
    emptyMessage: "No mall pages are available yet.",
    getEntities: (data) => data.malls
  },
  mrtStations: {
    key: "mrtStations",
    basePath: "/mrt-stations",
    eyebrow: "MRT Stations",
    title: "Halal Food Near MRT Stations",
    description: "Browse halal food places near MRT stations across Singapore.",
    countLabel: "MRT stations",
    emptyMessage: "No MRT station pages are available yet.",
    getEntities: (data) => data.mrtStations
  }
} satisfies Record<EntityCollectionKey, EntityPageConfig>;
