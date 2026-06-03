import { slugify } from "./slug";
import type {
  AirtableLinkedRecord,
  AirtableRecord,
  DirectoryData,
  DirectoryEntity,
  FoodPlace,
  LinkedEntitySummary,
  RawDirectoryData
} from "./types";

export const TABLES = {
  foodPlaces: "tblZtet0cMLi6fpsd",
  brands: "tbl6OL27TRRJcMeFB",
  neighbourhoods: "tbld3hGvfUKsOkZz5",
  malls: "tblNHIMo2JeeXshr9",
  mrtStations: "tblk6wqWRk16yY45D"
} as const;

export const FIELDS = {
  foodPlaces: {
    placeName: "fldgcSF6Fx6mmWzu2",
    address: "fld7gnpTOKkZe3dIO",
    slug: "fldOo8LvtYfSDkjfz",
    brand: "fldzBH7Zk80AYQiZX",
    phone: "fld3Phb9POAtCUb5P",
    category: "fldZ3PTfN6IpqjpEk",
    streetName: "fldt9L1qSa0hXMiJW",
    postalCode: "fldAgGmuu0mtzOxbf",
    neighbourhood: "fldLa5ewVJEvNuesO",
    mall: "fldkBtytmhdwcHQLh",
    mrt: "fldFzC5orRtujErco",
    openingHours: "fldsXc6kXCVoMh2Bz",
    certificationNumber: "fldeF4n0Y9GNXFooy",
    status: "fldbfWcWb6TI05bfJ",
    description: "fldtNgn2iwAeekkOp",
    websiteUrl: "fld4KizsgKnBP2utQ",
    facebookUrl: "fldP3AGDTOHXH44R7",
    instagramUrl: "fldhExiYQIN7RAJ8Y",
    googleMapsUrl: "fldji9febQEjkMfN1",
    imageUrl: "fldBMHLY2uXhsN4fF",
    galleryImageUrl: "fldgOgZDw5MS60s4X",
    featured: "fldaxulW34UhrK764"
  },
  brands: {
    name: "fldoRlPEiUzBtv1io",
    slug: "fldPbXwr7jP6eIyH7",
    places: "fldt170QMF1Ns36GE"
  },
  neighbourhoods: {
    name: "fld3NrLuamdOa6g3T",
    slug: "fldxvjwCbGtllzfro",
    places: "fldqJICPnDsS9VXWD"
  },
  malls: {
    name: "fld3f636Scz9U8FGu",
    slug: "fldJgc4DNoNxj8Vaj",
    places: "fldZOmnp6zlSMcKF6"
  },
  mrtStations: {
    name: "fldvgCAt1Exb33CpN",
    slug: "fldIuz0UqN72QCGow",
    places: "fldSLUpt1XSjM2kiK"
  }
} as const;

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80";

function text(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value && typeof value === "object" && "name" in value && typeof value.name === "string") return value.name;
  return "";
}

function cleanUrl(value: unknown): string {
  return text(value).trim();
}

function field(fields: Record<string, unknown>, fieldId: string, fieldName: string): unknown {
  return fields[fieldId] ?? fields[fieldName];
}

function links(value: unknown): AirtableLinkedRecord[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is AirtableLinkedRecord => {
    return typeof item === "string" || (Boolean(item) && typeof item === "object" && "id" in item);
  });
}

function linkId(link: AirtableLinkedRecord): string {
  return typeof link === "string" ? link : link.id;
}

function linkName(link: AirtableLinkedRecord): string {
  return typeof link === "string" ? "" : link.name ?? "";
}

function entityFromRecord(record: AirtableRecord, nameField: string, slugField: string, placesField: string): DirectoryEntity {
  const name = text(record.fields[nameField]);
  const slug = text(record.fields[slugField]).trim() || slugify(name);
  return {
    id: record.id,
    name,
    slug,
    placeIds: links(record.fields[placesField]).map(linkId),
    placeCount: 0
  };
}

function entityMap(entities: DirectoryEntity[]): Map<string, DirectoryEntity> {
  return new Map(entities.map((entity) => [entity.id, entity]));
}

function entityNameMap(entities: DirectoryEntity[]): Map<string, DirectoryEntity> {
  const lookup = new Map<string, DirectoryEntity>();
  for (const entity of entities) {
    lookup.set(slugify(entity.name), entity);
    lookup.set(slugify(entity.slug), entity);
  }
  return lookup;
}

function resolveLinks(value: unknown, lookup: Map<string, DirectoryEntity>): LinkedEntitySummary[] {
  return links(value)
    .map((link) => {
      const id = linkId(link);
      const entity = lookup.get(id);
      const name = linkName(link) || entity?.name || "";
      if (!name) return null;
      return {
        id,
        name,
        slug: entity?.slug || slugify(name)
      };
    })
    .filter((item): item is LinkedEntitySummary => Boolean(item));
}

function resolveTextReferences(value: unknown, lookup: Map<string, DirectoryEntity>): LinkedEntitySummary[] {
  const name = text(value).trim();
  if (!name) return [];

  const entity = lookup.get(slugify(name));
  if (entity) {
    return [{ id: entity.id, name: entity.name, slug: entity.slug }];
  }

  return [{ id: slugify(name), name, slug: slugify(name) }];
}

function resolveEntityReferences(
  value: unknown,
  idLookup: Map<string, DirectoryEntity>,
  nameLookup: Map<string, DirectoryEntity>
): LinkedEntitySummary[] {
  return Array.isArray(value) ? resolveLinks(value, idLookup) : resolveTextReferences(value, nameLookup);
}

function normalizePlace(
  record: AirtableRecord,
  lookups: {
    brands: Map<string, DirectoryEntity>;
    brandsByName: Map<string, DirectoryEntity>;
    neighbourhoods: Map<string, DirectoryEntity>;
    neighbourhoodsByName: Map<string, DirectoryEntity>;
    malls: Map<string, DirectoryEntity>;
    mallsByName: Map<string, DirectoryEntity>;
    mrtStations: Map<string, DirectoryEntity>;
    mrtStationsByName: Map<string, DirectoryEntity>;
  }
): FoodPlace {
  const fields = record.fields;
  const name = text(fields[FIELDS.foodPlaces.placeName]);
  const slug = text(fields[FIELDS.foodPlaces.slug]).trim() || slugify(name);

  return {
    id: record.id,
    slug,
    name,
    address: text(fields[FIELDS.foodPlaces.address]),
    phone: text(fields[FIELDS.foodPlaces.phone]),
    category: text(fields[FIELDS.foodPlaces.category]),
    streetName: text(fields[FIELDS.foodPlaces.streetName]),
    postalCode: text(fields[FIELDS.foodPlaces.postalCode]),
    openingHours: text(fields[FIELDS.foodPlaces.openingHours]),
    certificationNumber: text(fields[FIELDS.foodPlaces.certificationNumber]),
    status: text(fields[FIELDS.foodPlaces.status]),
    description: text(fields[FIELDS.foodPlaces.description]),
    websiteUrl: cleanUrl(fields[FIELDS.foodPlaces.websiteUrl]),
    facebookUrl: cleanUrl(fields[FIELDS.foodPlaces.facebookUrl]),
    instagramUrl: cleanUrl(fields[FIELDS.foodPlaces.instagramUrl]),
    googleMapsUrl: cleanUrl(fields[FIELDS.foodPlaces.googleMapsUrl]),
    imageUrl: cleanUrl(field(fields, FIELDS.foodPlaces.imageUrl, "Image URL")) || FALLBACK_IMAGE,
    galleryImageUrl: cleanUrl(field(fields, FIELDS.foodPlaces.galleryImageUrl, "Gallery Images URL")),
    featured: fields[FIELDS.foodPlaces.featured] === true,
    brands: resolveEntityReferences(fields[FIELDS.foodPlaces.brand], lookups.brands, lookups.brandsByName),
    neighbourhoods: resolveEntityReferences(
      fields[FIELDS.foodPlaces.neighbourhood],
      lookups.neighbourhoods,
      lookups.neighbourhoodsByName
    ),
    malls: resolveEntityReferences(fields[FIELDS.foodPlaces.mall], lookups.malls, lookups.mallsByName),
    mrtStations: resolveEntityReferences(fields[FIELDS.foodPlaces.mrt], lookups.mrtStations, lookups.mrtStationsByName)
  };
}

function placeCounts(places: FoodPlace[], type: "brands" | "neighbourhoods" | "malls" | "mrtStations"): Map<string, number> {
  const counts = new Map<string, number>();
  for (const place of places) {
    for (const entity of place[type]) {
      counts.set(entity.id, (counts.get(entity.id) ?? 0) + 1);
    }
  }
  return counts;
}

function countPlaces(entities: DirectoryEntity[], counts: Map<string, number>): DirectoryEntity[] {
  return entities
    .map((entity) => ({
      ...entity,
      placeCount: counts.get(entity.id) ?? 0
    }))
    .sort((a, b) => b.placeCount - a.placeCount || a.name.localeCompare(b.name));
}

export function normalizeDirectoryData(raw: RawDirectoryData): DirectoryData {
  const brands = raw.brands
    .map((record) => entityFromRecord(record, FIELDS.brands.name, FIELDS.brands.slug, FIELDS.brands.places))
    .filter((entity) => entity.name && entity.slug);
  const neighbourhoods = raw.neighbourhoods.map((record) =>
    entityFromRecord(record, FIELDS.neighbourhoods.name, FIELDS.neighbourhoods.slug, FIELDS.neighbourhoods.places)
  ).filter((entity) => entity.name && entity.slug);
  const malls = raw.malls
    .map((record) => entityFromRecord(record, FIELDS.malls.name, FIELDS.malls.slug, FIELDS.malls.places))
    .filter((entity) => entity.name && entity.slug);
  const mrtStations = raw.mrtStations.map((record) =>
    entityFromRecord(record, FIELDS.mrtStations.name, FIELDS.mrtStations.slug, FIELDS.mrtStations.places)
  ).filter((entity) => entity.name && entity.slug);

  const lookups = {
    brands: entityMap(brands),
    brandsByName: entityNameMap(brands),
    neighbourhoods: entityMap(neighbourhoods),
    neighbourhoodsByName: entityNameMap(neighbourhoods),
    malls: entityMap(malls),
    mallsByName: entityNameMap(malls),
    mrtStations: entityMap(mrtStations),
    mrtStationsByName: entityNameMap(mrtStations)
  };

  const places = raw.foodPlaces
    .map((record) => normalizePlace(record, lookups))
    .filter((place) => place.name && place.slug);
  const categories = [...new Set(places.map((place) => place.category).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );

  return {
    places,
    featuredPlaces: places.filter((place) => place.featured),
    brands: countPlaces(brands, placeCounts(places, "brands")),
    neighbourhoods: countPlaces(neighbourhoods, placeCounts(places, "neighbourhoods")),
    malls: countPlaces(malls, placeCounts(places, "malls")),
    mrtStations: countPlaces(mrtStations, placeCounts(places, "mrtStations")),
    categories
  };
}

export function placesForEntity(places: FoodPlace[], type: "brands" | "neighbourhoods" | "malls" | "mrtStations", id: string) {
  return places.filter((place) => place[type].some((entity) => entity.id === id));
}
