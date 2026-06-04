export type AirtableLinkedRecord = string | { id: string; name?: string };

export interface AirtableRecord {
  id: string;
  createdTime: string;
  fields: Record<string, unknown>;
}

export interface RawDirectoryData {
  foodPlaces: AirtableRecord[];
  brands: AirtableRecord[];
  neighbourhoods: AirtableRecord[];
  malls: AirtableRecord[];
  mrtStations: AirtableRecord[];
}

export interface DirectoryEntity {
  id: string;
  name: string;
  slug: string;
  description: string;
  placeIds: string[];
  placeCount: number;
}

export interface LinkedEntitySummary {
  id: string;
  name: string;
  slug: string;
}

export interface FoodPlace {
  id: string;
  slug: string;
  name: string;
  address: string;
  phone: string;
  category: string;
  streetName: string;
  postalCode: string;
  openingHours: string;
  certificationNumber: string;
  status: string;
  description: string;
  websiteUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  googleMapsUrl: string;
  imageUrl: string;
  galleryImageUrl: string;
  featured: boolean;
  brands: LinkedEntitySummary[];
  neighbourhoods: LinkedEntitySummary[];
  malls: LinkedEntitySummary[];
  mrtStations: LinkedEntitySummary[];
}

export interface DirectoryData {
  places: FoodPlace[];
  featuredPlaces: FoodPlace[];
  brands: DirectoryEntity[];
  neighbourhoods: DirectoryEntity[];
  malls: DirectoryEntity[];
  mrtStations: DirectoryEntity[];
  categories: string[];
}
