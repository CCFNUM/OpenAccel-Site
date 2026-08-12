# OpenAccel — Community Website

The documentation and community website for **OpenAccel**, an open-source,
vertex-based CVFEM solver for multiphysics CFD. The site hosts the User Guide,
Theory Manual, validation tutorials, publications, and contributor information,
and is deployed to GitHub Pages at
[ccfnum.github.io/OpenAccel-Site](https://ccfnum.github.io/OpenAccel-Site/).

> This repository is the **website**. The solver itself lives in
> [`CCFNUM/OpenAccel`](https://github.com/CCFNUM/OpenAccel).

## Tech stack

- **React 19** + **TypeScript**, bundled with **Vite**
- **Tailwind CSS** and **Radix UI** for styling and primitives
- **KaTeX** for mathematics, **wouter** for routing
- **pnpm** for package management
- Deployed to **GitHub Pages** via GitHub Actions

## Local development

Requires Node.js (current LTS) and pnpm.

```bash
pnpm install      # install dependencies
pnpm dev          # start the dev server (Vite, host 0.0.0.0)
```

The dev server prints a local URL (and a LAN URL, since it binds `0.0.0.0`).

Other useful scripts:

```bash
pnpm build        # production build
pnpm serve        # preview the production build locally
pnpm typecheck    # type-check without emitting
```

## Project structure

```
src/
  pages/            Top-level route pages (Home, Community, Support, Develop, …)
  content/
    cases/          One file per validation/tutorial case: <slug>.tsx
    tutorials.ts    Tutorial registry (metadata for each case)
    publications.ts Publications list
  components/        Shared UI (SpotlightCard, FluidCanvas, FluidSim, DataFlow, …)
  config/           Site configuration (e.g. community.ts: GitHub org/repo)
public/
  figures/          Figure assets (SVG), referenced by tutorial cases
```

## Contributing content

### Add a tutorial / validation case

1. Create the case component at `src/content/cases/<slug>.tsx` with the
   structured case content (setup, figures, results, discussion).
2. Register its metadata entry in `src/content/tutorials.ts` so it appears in
   the tutorials index and resolves at `/tutorials/<slug>`.
3. Place any figures as **SVG** in `public/figures/` and reference them from the
   case (PDF sources should be converted to SVG first).

### Add a publication

Add an entry to `src/content/publications.ts`.

### Contributors

The contributor list is generated automatically from the GitHub repository —
once a contribution is merged into `CCFNUM/OpenAccel`, the author appears on the
site. The organisation and repository are configured in `src/config/community.ts`;
there is no contributor file to edit by hand.

## Deployment

The site is built and published to GitHub Pages by a GitHub Actions workflow.
Because it is served from a project subpath, the build sets the base path via a
`BASE_PATH` environment variable (`/OpenAccel-Site/`), and the workflow copies
`dist/index.html` to `dist/404.html` so that client-side routes survive a direct
refresh on a subpage.

## Acknowledgements

The interactive hero and section fluid effects are built on the GPU
Navier–Stokes method popularised by Pavel Dobryakov's
[WebGL-Fluid-Simulation](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation)
(MIT), re-implemented for this site's palette and constraints.

## License

<!-- TODO -->
