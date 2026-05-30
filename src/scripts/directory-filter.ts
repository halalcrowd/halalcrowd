import type { FoodPlace } from "../lib/types";

type FilterablePlace = Pick<
  FoodPlace,
  "name" | "slug" | "address" | "category" | "brands" | "neighbourhoods" | "malls" | "mrtStations"
>;

declare global {
  interface Window {
    __DIRECTORY_PLACES__?: FilterablePlace[];
  }
}

const places = window.__DIRECTORY_PLACES__ ?? [];
const form = document.querySelector<HTMLFormElement>("#directory-filters");
const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-place-card]"));
const count = document.querySelector<HTMLElement>("#directory-count");
const empty = document.querySelector<HTMLElement>("#directory-empty");

function value(id: string): string {
  return document.querySelector<HTMLInputElement | HTMLSelectElement>(id)?.value.trim().toLowerCase() ?? "";
}

function hasEntity(place: FilterablePlace, key: "brands" | "neighbourhoods" | "malls" | "mrtStations", slug: string): boolean {
  return !slug || place[key].some((entity) => entity.slug === slug);
}

function placeMatches(place: FilterablePlace): boolean {
  const query = value("#filter-query");
  const haystack = [
    place.name,
    place.address,
    place.category,
    ...place.brands.map((item) => item.name),
    ...place.neighbourhoods.map((item) => item.name),
    ...place.malls.map((item) => item.name),
    ...place.mrtStations.map((item) => item.name)
  ]
    .join(" ")
    .toLowerCase();

  return (
    (!query || haystack.includes(query)) &&
    hasEntity(place, "neighbourhoods", value("#filter-neighbourhood")) &&
    hasEntity(place, "brands", value("#filter-brand")) &&
    (!value("#filter-category") || place.category.toLowerCase() === value("#filter-category")) &&
    hasEntity(place, "mrtStations", value("#filter-mrt")) &&
    hasEntity(place, "malls", value("#filter-mall"))
  );
}

function applyFilters(): void {
  const visible = new Set(places.filter(placeMatches).map((place) => place.slug));
  cards.forEach((card) => {
    card.hidden = !visible.has(card.dataset.placeCard ?? "");
  });
  if (count) count.textContent = `${visible.size} ${visible.size === 1 ? "place" : "places"}`;
  if (empty) empty.hidden = visible.size > 0;
}

form?.addEventListener("input", applyFilters);
form?.addEventListener("reset", () => window.setTimeout(applyFilters, 0));
applyFilters();
