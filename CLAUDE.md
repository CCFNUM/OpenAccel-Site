# CLAUDE.md — Working rules for the OpenAccel website

You are helping build the OpenAccel project website: a React 19 + Vite +
TypeScript + Tailwind static site, deployed to GitHub Pages. Read this file fully
before doing anything. Read DESIGN-BRIEF.md (same folder) before touching any
visual element — it is authoritative for how things must look.

## What this project is

- A documentation + project website for OpenAccel, an open-source vertex-centred
  CVFEM multiphysics CFD/FSI solver (C++20, Trilinos/STK, MPI). Modelled on the
  SU2 project site: clean, academic, community-facing.
- Static only. No backend, no database. Anything requiring a server is out of
  scope. Live data (GitHub stars/version) comes from the public GitHub API at
  runtime via src/lib/github.ts — that is the only external call.
- Code repo: github.com/CCFNUM/OpenAccel. This website: github.com/CCFNUM/OpenAccel-site,
  serving at ccfnum.github.io/OpenAccel-site/.

## Source of truth for CONTENT

Website content comes from the author's LaTeX manuals, kept OUTSIDE this repo at
~/openaccel-web/manuals-source/:
- user-guide/   -> the "Get Started" section (12 chapters + troubleshooting)
- theory-guide/ -> the "Theory Manual" section (19 chapters + appendix)
- vv-manual/    -> the "Tutorials" / validation cases (25 cases)

Each manual is modular: main.tex plus chapters/*.tex (or cases/*.tex), a
references.bib, and a figures/ (or Figures/) folder.

You read from these .tex files directly. You transcribe the author's real content
into the site's React components. You do NOT invent content.

### CRITICAL — the current site content is WRONG

The original author generated placeholder/fabricated content for the Get Started
(User Guide) chapters: invented commands, invented input-file keys, invented
setup. It must be REPLACED, chapter by chapter, with the real content from
~/openaccel-web/manuals-source/user-guide/chapters/, verbatim in meaning.

Content rules:
- Never invent an OpenAccel keyword, input-file key, command, or parameter. Every
  such token must come from the author's .tex source. If the .tex does not state
  it, it does not go on the site.
- Do not "improve" or paraphrase technical statements. Transcribe the author's
  wording and structure faithfully into web components.
- Preserve equation notation exactly (bold vectors/tensors, subscripts).
- If a .tex chapter references a figure, use the corresponding image from the
  manual's figures folder — converted to PNG/SVG if it is a PDF.
- If something in the .tex is genuinely unclear or missing, leave a visible TODO
  callout naming what is needed — never paper over it with a guess.

## Chapter -> page mapping

USER GUIDE (manuals-source/user-guide/chapters/) -> src/pages/get-started/:
  01_introduction.tex        -> Ch1Introduction.tsx
  02_installation.tex        -> Ch2Installation.tsx
  03_running.tex             -> Ch3Running.tsx
  04_inputfile.tex           -> Ch4InputFile.tsx
  05_mesh.tex                -> Ch5Mesh.tsx
  06_physan.tex              -> Ch6PhysicalAnalysis.tsx
  07_interfaces.tex          -> Ch7Interfaces.tsx
  08_numerics.tex            -> Ch8Numerics.tsx
  09_materials.tex           -> Ch9Materials.tsx
  10_output.tex              -> Ch10Output.tsx
  11_suite.tex               -> Ch11Suite.tsx
  12_tutorial.tex            -> Ch12WorkedExample.tsx
  appendix_troubleshooting.tex -> AppTroubleshooting.tsx

THEORY GUIDE (manuals-source/theory-guide/chapters/) -> src/pages/Theory.tsx and
sub-pages to be created following the same modular pattern (19 chapters).

VALIDATION (manuals-source/vv-manual/cases/) -> src/content/cases/*.tsx (25 cases;
existing case files are the format template — extend, do not fork). Case 25
(25_layered_pipe.tex) is NEW and has no page yet.

## Design / styling

- Follow DESIGN-BRIEF.md exactly. Both light and dark themes must work for every
  element. Never hardcode a colour — use CSS tokens from src/index.css; add new
  tokens to BOTH theme blocks if needed.
- Key-result box = deep teal (--key), titled "Key result".
- Tables: header row only, no zebra striping.
- Figures: PNG/SVG only; never an <img> pointing at a PDF.
- Extend the author's existing components (src/pages/get-started/GsLayout.tsx,
  src/components/CodeBlock.tsx, src/components/tutorial/*). Do not create parallel
  duplicates.

## How to work (workflow discipline)

- One chapter at a time. Do NOT mass-convert all chapters in one go. Do Chapter 1
  fully as a pilot, stop, and let the author review before continuing.
- Complete files. When you rewrite a page component, output the whole file, not
  fragments/diffs.
- Verify before claiming done. After editing, run the dev server / typecheck and
  confirm it renders in both themes before saying a task is complete. Commands:
  pnpm dev (serve), pnpm typecheck, pnpm build (production build).
- Small, tracked steps. Commit after each chapter with a clear message. Never make
  large irreversible sweeps. Everything must stay reviewable and revertable.
- Ask, don't assume. If a design or content decision is ambiguous, ask the author.

## Environment

- Node 24 via nvm; package manager is pnpm (not npm/yarn).
- Dev server: PORT=5173 pnpm dev, then open http://localhost:5173/
  (BASE_PATH defaults to / for local; deploy sets it to /OpenAccel-site/).
- Do not commit node_modules/, dist/, or .vite/ (already in .gitignore).

## Out of scope unless asked

- No analytics, tracking, or third-party embeds.
- Do not upgrade major dependency versions (React, Vite, Tailwind) — pinned
  deliberately.
- Do not add a backend or any server-side feature.

## "How to Read This Guide" pages + per-manual box vocabularies (IMPORTANT)

Each manual defines its OWN box vocabulary and its own reader's guide, in its
main.tex (the \chapter*{How to Use/Read This Guide} section). These differ
between manuals and MUST be reproduced per section — a single global legend is
WRONG.

Known differences (verify against each main.tex before building):
- USER GUIDE boxes: warning (gold), tip (blue), note (grey). No key/source box.
  Its "How to Use This Guide" also contains a chapter->input-file-block mapping
  TABLE (reproduce it, header-row-only per DESIGN-BRIEF.md).
- THEORY GUIDE boxes: key-result (teal, "headline equation to remember"),
  note ("modelling assumption / limit of validity"), caution (gold — same colour
  as the User Guide warning but LABELLED "Caution" with a theory-specific
  meaning), implementation/source (slate, "maps theory to the module").
- V&V MANUAL boxes: read manuals-source/vv-manual/main.tex for its own "how to
  read" section and box set; reproduce whatever it defines.

Requirements:
1. Create a "How to Read This Guide" page for EACH section (Get Started, Theory
   Manual, Tutorials/V&V), transcribing that manual's real audience /
   organisation / conventions text from its main.tex, including a legend that
   shows every box that manual uses WITH that manual's own label and definition.
   Add it as the first entry in that section's navigation.
2. Box components must carry the correct label per context: the same gold box is
   "Warning" in Get Started but "Caution" in Theory. Do not hardcode one global
   label. Each box's definition/label follows the manual it appears in.
3. Colours may be shared across manuals (per DESIGN-BRIEF.md tokens), but the
   LABEL and MEANING are per-manual. Keep them distinguishable and documented.
