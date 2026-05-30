# Halal Crowd Directory Design

## Goal

Build a production-ready static Astro website for a Singapore-only halal food directory using Airtable as the build-time content source and Cloudflare Pages as the deployment target.

## Architecture

The site is generated entirely at build time. `src/lib/airtable.ts` fetches all Airtable records with REST API pagination using `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID`. `src/lib/content.ts` normalizes Food Places, Brands, Neighbourhoods, Malls, and MRT Stations into static route data, resolves linked names, trims external URLs, creates slugs for non-place entities, and filters active places where Status is present.

The directory page ships a prebuilt JSON payload and a small client-side filter script for neighbourhood, brand, category, MRT, and mall filtering. Pagefind indexes the built `dist` output after `npm run build`.

## Visual Direction

The interface uses a refined editorial directory style inspired by The Scout Guide: warm white surfaces, restrained charcoal text, thin dividers, refined serif headings, clean sans body text, spacious listing cards, image-led place pages, and a muted halal-green accent. The site avoids generic city pages and treats Singapore as the whole market, with discovery organized around neighbourhoods, brands, malls, and MRT stations.

## Pages

- `/`: homepage with editorial hero, search entry, top neighbourhoods by outlet count, all four brands, and featured outlets.
- `/directory`: client-filterable index of active food places.
- `/halal-food-places/[slug]`: outlet detail page generated from the Food Places `Slug` field with JSON-LD LocalBusiness data.
- `/brands/[slug]`: brand page with outlet count and brand outlets.
- `/neighbourhoods/[slug]`: neighbourhood page with all outlets in that neighbourhood.
- `/malls/[slug]`: mall/location page with all outlets in that mall.
- `/mrt-stations/[slug]`: station page with all outlets near that MRT station.
- `/search`: Pagefind search UI.

## Data Rules

- Food Places table: `tblZtet0cMLi6fpsd`
- Brands table: `tbl6OL27TRRJcMeFB`
- Neighbourhoods table: `tbld3hGvfUKsOkZz5`
- Malls table: `tblNHIMo2JeeXshr9`
- MRT Stations table: `tblk6wqWRk16yY45D`
- Use field IDs for Airtable mapping.
- Treat a Food Place as active when `Status` is not empty.
- Trim `Website URL`, `Facebook URL`, `Instagram URL`, and `Google Maps URL` values.
- Generate non-place slugs from `Name` using lowercase hyphenation.
- Use linked record names from Airtable when available, with table lookups as fallback.

## Deployment

Cloudflare Pages uses:

- Build command: `npm run build && npx pagefind --site dist`
- Output directory: `dist`
- Environment variables: `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`

The repository includes `README.md`, `.env.example`, Astro/Tailwind configuration, Pagefind setup notes, and deployment instructions.
