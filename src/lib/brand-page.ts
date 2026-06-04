import type { DirectoryEntity, FoodPlace, LinkedEntitySummary } from "./types";

export interface BrandPageCount {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface BrandPageProfile {
  heroImageUrl: string;
  statusLabel: string;
  categories: string[];
  popularAreas: BrandPageCount[];
  popularMalls: BrandPageCount[];
}

const MAX_SUMMARY_ITEMS = 5;

export function getBrandPageProfile(_brand: DirectoryEntity, places: FoodPlace[]): BrandPageProfile {
  return {
    heroImageUrl: places.find((place) => place.imageUrl)?.imageUrl ?? "",
    statusLabel: places.find((place) => place.status)?.status ?? "",
    categories: uniqueValues(places.map((place) => place.category)).slice(0, MAX_SUMMARY_ITEMS),
    popularAreas: countLinkedEntities(places.flatMap((place) => place.neighbourhoods)).slice(0, MAX_SUMMARY_ITEMS),
    popularMalls: countLinkedEntities(places.flatMap((place) => place.malls)).slice(0, MAX_SUMMARY_ITEMS)
  };
}

function uniqueValues(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function countLinkedEntities(entities: LinkedEntitySummary[]): BrandPageCount[] {
  const counts = new Map<string, BrandPageCount>();

  for (const entity of entities) {
    const current = counts.get(entity.id);
    if (current) {
      current.count += 1;
      continue;
    }
    counts.set(entity.id, { ...entity, count: 1 });
  }

  return [...counts.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
