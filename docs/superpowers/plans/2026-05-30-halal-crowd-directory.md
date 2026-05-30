# Halal Crowd Directory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready Astro/Tailwind static halal food directory for Singapore using Airtable build-time content and Pagefind search.

**Architecture:** Fetch all Airtable tables at build time, normalize linked records into typed content models, generate static Astro pages for each entity, and use a small client-side script for directory filtering. Pagefind indexes `dist` after Astro builds.

**Tech Stack:** Astro, TypeScript, Tailwind CSS, Airtable REST API, Pagefind, Vitest, Cloudflare Pages.

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tailwind.config.mjs`
- Create: `tsconfig.json`
- Create: `src/styles/global.css`
- Create: `.env.example`
- Modify: `.gitignore`

- [ ] Add Astro, Tailwind, TypeScript, Vitest, and Pagefind scripts.
- [ ] Configure Tailwind content scanning for Astro and TypeScript files.
- [ ] Add global tokens for the editorial visual system.

### Task 2: Data Model And Tests

**Files:**
- Create: `src/lib/slug.ts`
- Create: `src/lib/types.ts`
- Create: `src/lib/content.ts`
- Create: `src/lib/content.test.ts`

- [ ] Write Vitest tests proving slug generation, active-place filtering, linked record fallback resolution, and URL trimming.
- [ ] Run `npm test -- src/lib/content.test.ts` and verify tests fail before implementation.
- [ ] Implement the minimum data normalization helpers.
- [ ] Re-run tests and keep them passing.

### Task 3: Airtable Fetcher

**Files:**
- Create: `src/lib/airtable.ts`

- [ ] Implement environment validation for `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID`.
- [ ] Implement paginated table fetching with Airtable REST API `offset` handling.
- [ ] Export `getDirectoryData()` to fetch and normalize all five tables.

### Task 4: Core Components

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/SiteHeader.astro`
- Create: `src/components/SiteFooter.astro`
- Create: `src/components/PlaceCard.astro`
- Create: `src/components/EntityGrid.astro`
- Create: `src/components/FilterBar.astro`

- [ ] Build accessible layout, navigation, cards, badges, grids, and filter controls.
- [ ] Ensure cards reserve image space and work on mobile.

### Task 5: Static Pages

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/pages/directory.astro`
- Create: `src/pages/search.astro`
- Create: `src/pages/halal-food-places/[slug].astro`
- Create: `src/pages/brands/[slug].astro`
- Create: `src/pages/neighbourhoods/[slug].astro`
- Create: `src/pages/malls/[slug].astro`
- Create: `src/pages/mrt-stations/[slug].astro`

- [ ] Generate every route from Airtable data.
- [ ] Add Pagefind body and metadata attributes to searchable content.
- [ ] Add JSON-LD LocalBusiness data on outlet pages.

### Task 6: Directory Filtering

**Files:**
- Create: `src/scripts/directory-filter.ts`
- Modify: `src/pages/directory.astro`

- [ ] Serialize active place data into the page.
- [ ] Filter by search query, neighbourhood, brand, category, MRT, and mall.
- [ ] Show result counts and an empty state.

### Task 7: Documentation And Verification

**Files:**
- Create: `README.md`

- [ ] Document local setup, Airtable env vars, Cloudflare Pages settings, and deploy hook workflow.
- [ ] Run `npm test`.
- [ ] Run `npm run build`.
- [ ] Run `npx pagefind --site dist`.
- [ ] Start the dev server and inspect the local site if dependencies install successfully.
