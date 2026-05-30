import { normalizeDirectoryData, TABLES } from "./content";
import type { AirtableRecord, DirectoryData, RawDirectoryData } from "./types";

interface AirtableListResponse {
  records: AirtableRecord[];
  offset?: string;
}

let directoryDataPromise: Promise<DirectoryData> | undefined;

function getEnv(name: "AIRTABLE_API_KEY" | "AIRTABLE_BASE_ID"): string {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(`${name} is required. Add it to .env locally and Cloudflare Pages environment variables.`);
  }
  return value;
}

async function fetchTable(tableId: string): Promise<AirtableRecord[]> {
  const apiKey = getEnv("AIRTABLE_API_KEY");
  const baseId = getEnv("AIRTABLE_BASE_ID");
  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const params = new URLSearchParams({ pageSize: "100", returnFieldsByFieldId: "true" });
    if (offset) params.set("offset", offset);

    const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Airtable request failed for ${tableId}: ${response.status} ${body}`);
    }

    const payload = (await response.json()) as AirtableListResponse;
    records.push(...payload.records);
    offset = payload.offset;
  } while (offset);

  return records;
}

export async function getRawDirectoryData(): Promise<RawDirectoryData> {
  const [foodPlaces, brands, neighbourhoods, malls, mrtStations] = await Promise.all([
    fetchTable(TABLES.foodPlaces),
    fetchTable(TABLES.brands),
    fetchTable(TABLES.neighbourhoods),
    fetchTable(TABLES.malls),
    fetchTable(TABLES.mrtStations)
  ]);

  return { foodPlaces, brands, neighbourhoods, malls, mrtStations };
}

export async function getDirectoryData(): Promise<DirectoryData> {
  directoryDataPromise ??= getRawDirectoryData().then(normalizeDirectoryData);
  return directoryDataPromise;
}
