# Saving Summary Builder

Saving Summary Builder is a Next.js MVP that turns Google Sheet fee data into a branded, paginated subscriber fee schedule with fixed 1600 x 2240 artboards and browser-PDF export.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- React 19
- No PDF or CSV dependencies

## Features

- Left-side settings and import panel
- Right-side fixed-page document preview
- Deterministic pagination for category blocks and overflow rows
- Branding controls for logo, table headers, category rows, and banner
- Editable title, banner, and disclaimer copy
- Public Google Sheet CSV import through a Next.js API route
- Browser print to PDF with artboard-sized pages

## Expected Google Sheet format

Header row:

`Category | CPT Code | Description | Adult Plan | Child Plan | Perio Plan | Loyalty Plan`

Plan columns can be renamed. The importer treats every column after `Description` as a plan column.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Vercel deployment

1. Push the project to a Git repository.
2. Import the repo into Vercel.
3. Deploy with the default Next.js settings.

No environment variables are required for the MVP.

## Notes on PDF export

- Use the `Export as PDF` button.
- The app uses the browser print flow so the on-screen artboards map directly to printable pages.
- For best results, choose `Save as PDF` and keep browser scaling at 100%.

## Architecture overview

- `components/builder-app.tsx`
  Main client orchestrator for state, import, preview, and export.
- `lib/pagination.ts`
  Fixed-height pagination engine for deterministic page splitting.
- `app/api/import-sheet/route.ts`
  Public Google Sheet CSV import endpoint.
- `components/document-page.tsx`
  Printable artboard renderer for each page.

## Optional v2 work

- Plan-column count that adjusts table widths beyond 4 plans
- Richer logo sizing controls
- Better CSV validation and field mapping UI
- Persistent document presets and saved sessions
- More accurate text measurement-based pagination instead of fixed row heights
