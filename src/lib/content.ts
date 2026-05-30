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
    places: "fldXzufBDtHMvQWvI"
  },
  malls: {
    name: "fld3f636Scz9U8FGu",
    slug: "fldJgc4DNoNxj8Vaj",
    places: "fldFs0jScxRCFD5Lk"
  },
  mrtStations: {
    name: "fldvgCAt1Exb33CpN",
    slug: "fldIuz0UqN72QCGow",
    places: "fld1z8zgOdV28FzOg"
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

function hasStatus(record: AirtableRecord): boolean {
  return text(record.fields[FIELDS.foodPlaces.status]).trim().length > 0;
}

function normalizePlace(
  record: AirtableRecord,
  lookups: {
    brands: Map<string, DirectoryEntity>;
    neighbourhoods: Map<string, DirectoryEntity>;
    malls: Map<string, DirectoryEntity>;
    mrtStations: Map<string, DirectoryEntity>;
  }
): FoodPlace {
  const fields = record.fields;
  const name = text(fields[FIELDS.foodPlaces.placeName]);
  const slug = text(fields[FIELDS.foodPlaces.slug]) || slugify(name);

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
    brands: resolveLinks(fields[FIELDS.foodPlaces.brand], lookups.brands),
    neighbourhoods: resolveLinks(fields[FIELDS.foodPlaces.neighbourhood], lookups.neighbourhoods),
    malls: resolveLinks(fields[FIELDS.foodPlaces.mall], lookups.malls),
    mrtStations: resolveLinks(fields[FIELDS.foodPlaces.mrt], lookups.mrtStations)
  };
}

function countActivePlaces(entities: DirectoryEntity[], activePlaceIds: Set<string>): DirectoryEntity[] {
  return entities
    .map((entity) => ({
      ...entity,
      placeCount: entity.placeIds.filter((placeId) => activePlaceIds.has(placeId)).length
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
    neighbourhoods: entityMap(neighbourhoods),
    malls: entityMap(malls),
    mrtStations: entityMap(mrtStations)
  };

  const places = raw.foodPlaces
    .filter(hasStatus)
    .map((record) => normalizePlace(record, lookups))
    .filter((place) => place.name && place.slug);
  const activePlaceIds = new Set(places.map((place) => place.id));
  const categories = [...new Set(places.map((place) => place.category).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );

  return {
    places,
    featuredPlaces: places.filter((place) => place.featured),
    brands: countActivePlaces(brands, activePlaceIds),
    neighbourhoods: countActivePlaces(neighbourhoods, activePlaceIds),
    malls: countActivePlaces(malls, activePlaceIds),
    mrtStations: countActivePlaces(mrtStations, activePlaceIds),
    categories
  };
}

export function placesForEntity(places: FoodPlace[], type: "brands" | "neighbourhoods" | "malls" | "mrtStations", id: string) {
  return places.filter((place) => place[type].some((entity) => entity.id === id));
}
