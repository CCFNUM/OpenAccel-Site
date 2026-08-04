# OpenAccel Community Website

An open-source, vertex-based CVFEM solver for multiphysics CFD.

## How to add a tutorial
Drop a tutorial entry in `src/content/tutorials.ts`, create `src/content/tutorial-detail-[slug].ts` with the structured detail content.

## How to add a publication
Add to `src/content/publications.ts`.

## How to add a gallery entry
Add to `src/content/gallery.ts`, add SVG placeholder in `src/assets/gallery/`.

## How to add a contributor
Add to `src/content/contributors.ts`.

## Dev setup
```bash
pnpm install
pnpm --filter @workspace/openaccel-site run dev
```