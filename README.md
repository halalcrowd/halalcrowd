# Halal Crowd

Production-ready static halal food directory for Singapore, built with Astro, Tailwind CSS, Airtable, Cloudflare Pages, and Pagefind.

## Local Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Set these values in `.env`:

```bash
AIRTABLE_API_KEY=your_api_key_here
AIRTABLE_BASE_ID=appQ6qk9H7WMvz91i
```

## Airtable

The build reads these tables from the `Halal Crowd` base:

- Food Places: `tblZtet0cMLi6fpsd`
- Brands: `tbl6OL27TRRJcMeFB`
- Neighbourhoods: `tbld3hGvfUKsOkZz5`
- Malls: `tblNHIMo2JeeXshr9`
- MRT Stations: `tblk6wqWRk16yY45D`

Food place, brand, neighbourhood, mall, and MRT station pages use their Airtable `Slug` fields. Brand, neighbourhood, mall, and MRT station records fall back to generated `Name` slugs if a slug is missing. Records with an empty `Status` field are excluded from active listings.

## Scripts

```bash
npm run dev       # local Astro dev server
npm test          # Vitest data normalization tests
npm run build     # Astro type check and static build
npm run pagefind  # build Pagefind index for dist
```

## Cloudflare Pages

Use these settings:

- Framework preset: Astro
- Build command: `npm run build && npx pagefind --site dist`
- Output directory: `dist`

Set environment variables in Cloudflare Pages:

```bash
AIRTABLE_API_KEY=your_api_key_here
AIRTABLE_BASE_ID=appQ6qk9H7WMvz91i
```

For Airtable content updates, create a Deploy Hook in Cloudflare Pages under Settings -> Build & deployments and trigger it from Airtable automation or a manual webhook call.
