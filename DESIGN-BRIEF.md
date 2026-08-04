# OpenAccel Website — Design Brief

This document defines the visual language for the OpenAccel website. It is the
authoritative reference for how every content element must look. Claude Code and
any contributor must follow it. The goal: the website should read like a
polished, theme-aware web version of the OpenAccel manuals (User Guide, Theory
Guide, Validation Manual) — clean and academic, restrained, documentation-grade,
comparable to SU2 / deal.II / OpenFOAM project sites, not a flashy marketing page.

The site already ships a light/dark theme system (src/index.css,
src/hooks/use-theme.ts), driven by a data-theme attribute on <html> with values
dark and light. Every rule below must hold in BOTH themes. Never hardcode a raw
colour in a component. Always reference a CSS token (var(--...)). If a needed
token does not exist, add it to BOTH the [data-theme="dark"] and
[data-theme="light"] blocks in src/index.css, contrast-checked, before using it.

Golden test for every element: if the background were near-black (dark) or
near-white (light), would every piece of text still be clearly legible?
Target WCAG AA (>= 4.5:1 for body text) in both themes.

---

## 1. Existing token system (keep and extend — do not replace)

Neutrals (per theme): --ink (page bg), --surface (card), --surface-2 (raised),
--hairline (borders), --text (primary text), --text-dim (muted text).

Physics-semantic accents (keep — these encode meaning, do not repurpose):
--cold (blue) incompressible flow; --violet compressible flow/turbulence;
--flux (cyan) multiphase/VOF/free surface; --hot (orange) FSI/ALE/moving mesh;
--warm (yellow) heat transfer/CHT/buoyancy; --signal (green) solid mechanics.

Fonts: --font-sans Source Serif 4 (body); --font-serif Source Serif 4;
--font-display Source Serif 4 (headings) — weights 400/600 only. --font-mono
IBM Plex Mono (code/keys) is the one holdout: code blocks, YAML keys, and
monospace labels stay IBM Plex Mono in both themes.

---

## 2. NEW tokens to add (the manual's signature elements)

Add these to BOTH theme blocks in src/index.css. Values are contrast-checked
starting points; keep exact hex unless a contrast check fails.

### 2a. Key-result box (--key) — the manual's keybox, "Key result"
A DEEP TEAL, deliberately pushed away from --signal (success green) and --flux
(cyan) so it reads as its own "important result" element.

[data-theme="dark"] {
  --key:          #5DCAA5;
  --key-frame:    #0F6E56;
  --key-bg:       rgba(93,202,165,0.10);
  --key-title-fg: #04231D;
  --key-body-fg:  #9FE1CB;
}
[data-theme="light"] {
  --key:          #0F6E56;
  --key-frame:    #0F6E56;
  --key-bg:       #E1F5EE;
  --key-title-fg: #FFFFFF;
  --key-body-fg:  #04342C;
}

Structure (matches LaTeX keybox): a titled box. Title bar filled --key, title
text --key-title-fg, label "Key result" (sentence case). Body has 1px --key-frame
border, --key-bg fill, body text --key-body-fg. Rounded 8px, FULL border (never
single-sided). One or more per chapter, for the headline validated finding.

### 2b. Source / implementation box (--src) — the manual's srcbox
For pointers into the OpenAccel source tree ("Implementation." notes). Slate,
maps onto the cold/slate family so it stays quiet.

[data-theme="dark"] {
  --src:    #7FA8D0;
  --src-bg: rgba(59,130,246,0.06);
  --src-fg: #C5D6EA;
}
[data-theme="light"] {
  --src:    #1F3A5F;
  --src-bg: #EAF0F6;
  --src-fg: #1F3A5F;
}

Structure: full 1px --src border, 8px radius, --src-bg fill. Lead-in word
"Implementation." in bold --src, body text --src-fg, monospace for file/function
names. (A single-sided left border is allowed ONLY if radius is 0.)

---

## 3. Callouts — map the manual's three boxes onto existing accents

Do NOT invent new colours.
- Warning -> --warm (gold). Icon ti-alert-triangle. Label "Warning".
- Tip     -> --cold (blue).  Icon ti-bulb.            Label "Tip".
- Note    -> --text-dim neutral (grey). Icon ti-info-circle. Label "Note".

Each: full 1px accent border, faint accent-tinted bg (use existing --callout-*-bg
tokens where present, else accent ~0.08 alpha in dark / a pale solid tint in
light), 8px radius, small icon + bold sentence-case label, body in --text /
--text-dim. Must stay distinct from the Key box and from each other in BOTH
themes. Extend the existing Callout in src/pages/get-started/GsLayout.tsx; add the
Key box and Source box as new components.

---

## 4. Tables — HEADER ROW ONLY (hard rule)

Coloured header row only, NO alternating row stripes (zebra striping is removed).
- Header row: bg --surface-2, header text --cold (or --text if contrast fails),
  bold, sentence case, monospace for column keys.
- Body rows: plain --surface / transparent — NO zebra striping.
- Borders: outer border + single rule under the header (booktabs feel: top rule,
  header rule, bottom rule; minimal interior vertical lines).
- Left-align text columns. Wrap wide tables in overflow-x:auto so they never
  break narrow layouts.
Reuse/extend existing table styling (src/components/tutorial/SetupTable.tsx if
present) so all tables match.

---

## 5. Code blocks & the YAML-tree

5a. Standard code blocks (input.i YAML, shell): monospace --font-mono, bg
--surface-2, 8px radius, subtle 1px --hairline border. YAML accents: keys
--cold/--violet bold, comments --text-dim italic, strings a quiet accent. Keep
restrained. Extend src/components/CodeBlock.tsx.

5b. YAML-tree (the manual's yamltree): indented tree with faint vertical guide
rules (--hairline low opacity) and # comments. Keys bold; comments --text-dim
italic; "..." continuation dimmed. Boxed, captioned, labelled — mirrors
\begin{yamltree}{caption}{label}. Treat as a first-class component.

---

## 6. Equations

KaTeX (already a dependency). Display equations centred with right-aligned number
where the manual numbers them; inline math inline. Equation colour follows --text
(never hardcoded) so it flips with theme. Preserve manual notation EXACTLY: bold
vectors (\mathbf{v}), bold tensors (\boldsymbol{\tau}), \mathbf{S}_{ip}, etc. Do
not silently restyle notation.

---

## 7. Figures

Web figures must be PNG or SVG. PDF figures do NOT render inline in a browser —
never place a .pdf in an <img>. Where only a PDF exists, convert to PNG/SVG
(separate tracked task) before use.
Figure card: image on --surface, thin --hairline border, 8px radius, caption
BELOW in --text-dim, small, with bold sentence-case label ("Figure 3."). Caption
label style matches the manual (labelfont=bf, labelsep=period). Multi-panel
figures in a responsive grid with per-panel + overall captions. Never put the
label on the image line; label lives in the caption.

---

## 8. Headings & structure

Page title: --font-display, large, --text; restrained accent rule/number is fine.
H2 (section): bold, --text, clear top margin. H3: smaller, --text/--text-dim bold.
Preserve numbered section depth to 3 levels where the manual numbers (secnumdepth=3).
Sentence case for ALL headings and labels. Never Title Case, never ALL CAPS.

---

## 9. Non-negotiables (summary)

1. Both themes always. No hardcoded colours in components — tokens only.
2. Tables: header row only, no zebra stripes.
3. Key-result box = deep teal --key, titled "Key result", distinct from
   --signal/--flux.
4. Figures: PNG/SVG only, caption below with bold "Figure N." label.
5. Preserve manual notation in equations exactly.
6. Sentence case everywhere in chrome/labels.
7. Extend existing components (GsLayout, CodeBlock, tutorial/*); do not fork.
8. Clean & academic register: restrained, legible, documentation-grade.

## 10. Input-file location map (User Guide chapters) — the \inputmap diagram

Every User Guide chapter (Mesh, Physical Analysis, Interfaces, Numerics,
Materials, Output) opens with a LOCATION MAP: a tree diagram of the whole input.i
structure, with the ONE branch that chapter documents HIGHLIGHTED. This is the
LaTeX \inputmap / TikZ tree from the manual. Reproduce it as a first-class,
theme-aware component.

Structure of the tree (top to bottom), connected by elbow connectors:
  input.i
   ├─ mesh
   └─ simulation
       ├─ physical_analysis
       │   ├─ analysis_type
       │   ├─ domains[]
       │   ├─ rigid_bodies[]
       │   └─ interfaces[]
       ├─ solver
       │   ├─ solver_control
       │   ├─ output_control
       │   └─ restart_control
       └─ material_library

Appearance:
- All nodes are WHITE/neutral blocks by default: fill --surface, 1px --hairline
  border, monospace label (--font-mono), small radius. In DARK theme the same
  "white block" approach = fill --surface (the dark surface), --hairline border,
  --text label. The look is identical in spirit in both themes: neutral blocks on
  the page background.
- The ONE block this chapter covers is HIGHLIGHTED with a decent accent, in both
  themes: light theme uses a restrained maroon-family or teal-family highlight
  (fill a pale tint, border + text the accent); dark theme uses the SAME accent
  family tuned to sit well on the dark background (e.g. accent border + faint
  accent-tint fill + accent text). Use a dedicated token pair --map-highlight /
  --map-highlight-bg defined in BOTH theme blocks so it stays legible. Pick a
  highlight that is NOT confusable with the physics accents or the --key teal.
- Connectors: thin --hairline elbow lines (vertical + horizontal), like the LaTeX
  tree. Left-aligned, indented per depth level.
- Each block is a CLICKABLE LINK to that block's chapter/page (wouter route). On
  hover, subtle affordance. So a reader can click "solver_control" and land on the
  Numerics chapter, etc. The highlighted current-chapter block links to itself /
  is non-navigating.
- Monospace labels exactly as in the manual (mesh, physical_analysis, domains[],
  rigid_bodies[], interfaces[], solver_control, output_control, restart_control,
  material_library).

Build ONE reusable component (e.g. InputMap) that takes a "highlight" prop naming
which block to highlight, so every chapter passes its own block. Both themes,
legible, per the golden test.

## 11. "How to Read This Guide" pages — required per manual (recap + placement)

Get Started (User Guide) and Theory Manual each need their own "How to Read/Use
This Guide" page as the FIRST entry in that section, transcribed from that
manual's main.tex, showing ONLY the boxes that manual actually uses with that
manual's own labels/definitions. V&V/Tutorials does NOT get one. See CLAUDE.md
for the box vocabularies and the exact content requirements.

## 12. Code blocks & YAML-tree — AMENDED / AUTHORITATIVE (supersedes §5)

Two distinct presentations. Both must be visually distinct from ALL callout and
box backgrounds (Note grey, Tip blue, Warning gold, Key teal, Source slate) — code
must never look like a note.

### 12a. Dedicated code surface (both plain listings and YAML-tree)
Add a token pair to BOTH theme blocks in src/index.css:
- --code-bg  : the code panel background
- --code-border : a subtle 1px border (may reuse --hairline)

Contrast requirement (deliberate asymmetry between themes):
- LIGHT theme: --code-bg is HIGHER contrast than the Note background — a slightly
  darker / greyer inset panel, so code reads as a distinct framed surface.
- DARK theme: --code-bg is LOWER contrast than the Note background — closer to the
  page background (--ink), so the code well recedes calmly rather than competing
  with notes.
Code text and syntax accents must remain fully legible (WCAG AA) on --code-bg in
both themes. Apply --code-bg + --code-border to the CodeBlock component and as the
background of the YamlTree component. Do NOT alter callout/box colours.

### 12b. YAML-tree indentation guide-lines (REQUIRED)
The manual's yamltree (the \yguide macro in each main.tex) draws a faint VERTICAL
rule at each indentation level so parent/child/sibling nesting is legible. The
YamlTree component MUST render these:
- One thin vertical guide line per indentation level, running down the left edge
  of each nested level, aligned to the indent so a reader can trace which keys are
  siblings and which are nested.
- Colour: faint --hairline (low opacity) — visible but subtle, and legible in BOTH
  themes (tune per-theme opacity so it never vanishes on white or on dark).
- These guide-lines apply ONLY to the YamlTree (structure trees), NOT to plain
  full-file CodeBlock listings.

### 12c. YAML syntax accents (unchanged)
Keys bold in --cold/--violet; # comments in --text-dim italic; "..." continuation
dimmed; strings a quiet accent. Restrained — documentation, not a rainbow.

## 13. Input-file location map — AMENDED / AUTHORITATIVE (supersedes §10)

The first attempt was wrong: it lacked real tree connectors, the indentation was
too shallow to show hierarchy, and the highlight colour was wrong. This section is
authoritative. The target is the LaTeX \inputmap tree exactly: clear elbow
connectors and generous horizontal indentation so parent/child relationships are
obvious at a glance.

### 13a. Structure and hierarchy (indentation depths)
depth 0: input.i
  depth 1: mesh
  depth 1: simulation
    depth 2: physical_analysis
      depth 3: analysis_type
      depth 3: domains[]
      depth 3: rigid_bodies[]
      depth 3: interfaces[]
    depth 2: solver
      depth 3: solver_control
      depth 3: output_control
      depth 3: restart_control
    depth 2: material_library

### 13b. Connectors (REQUIRED — this was missing)
Draw a real TREE with elbow (L-shaped) connectors, like a file-explorer or the
LaTeX tree:
- From each parent, a VERTICAL line runs down its left side spanning all its
  children.
- To each child, a short HORIZONTAL line branches off that vertical to meet the
  child block's left edge (an elbow / "└─" and "├─" shape).
- Lines are thin, colour --hairline, clearly visible in both themes.
- The vertical for a parent stops at its LAST child (proper tree, not a full-height
  rail).
The reader must be able to trace, purely from the connector lines, that
analysis_type / domains[] / rigid_bodies[] / interfaces[] are children of
physical_analysis, etc.

### 13c. Horizontal indentation (INCREASE per level)
Each depth level indents notably MORE to the right than its parent — generous
horizontal spacing so children sit clearly to the right of their parent, matching
the User Guide PDF. Use a comfortable per-level indent (e.g. ~32-40px per depth
level, not a few px). Vertical spacing between blocks stays compact/normal; it is
only the HORIZONTAL indentation that increases. Children must never sit almost
under their parent — the offset must read clearly.

### 13d. Blocks
- Default blocks: neutral surface (--surface), 1px --hairline border, monospace
  label (--font-mono), small radius. Same neutral "white block" look in BOTH
  themes (dark: --surface fill, --hairline border, --text label).
- Highlighted block (the current chapter's): use the site's existing ORANGE
  accent token --hot (the orange from the hero/wordmark). Highlight = --hot border
  + faint --hot-tint fill + label colour that stays legible on that fill in BOTH
  themes. Add --map-highlight / --map-highlight-bg token pair mapping to the --hot
  family if needed for per-theme legibility. NOT pink, NOT teal, NOT maroon —
  the site orange (--hot).

### 13e. Interaction
Each block is a clickable wouter link to that block's chapter/page. Hover gives a
subtle affordance. The highlighted current block links to itself / does not
navigate.

### 13f. Component
One reusable component (InputMap) taking a `highlight` prop naming which block is
current, so every User Guide chapter drops it in with its own block highlighted.
Both themes, legible, real tree connectors, generous indentation.

## 13. Input-file location map — AMENDED / AUTHORITATIVE (supersedes §10)

The first attempt was wrong: it lacked real tree connectors, the indentation was
too shallow to show hierarchy, and the highlight colour was wrong. This section is
authoritative. The target is the LaTeX \inputmap tree exactly: clear elbow
connectors and generous horizontal indentation so parent/child relationships are
obvious at a glance.

### 13a. Structure and hierarchy (indentation depths)
depth 0: input.i
  depth 1: mesh
  depth 1: simulation
    depth 2: physical_analysis
      depth 3: analysis_type
      depth 3: domains[]
      depth 3: rigid_bodies[]
      depth 3: interfaces[]
    depth 2: solver
      depth 3: solver_control
      depth 3: output_control
      depth 3: restart_control
    depth 2: material_library

### 13b. Connectors (REQUIRED — this was missing)
Draw a real TREE with elbow (L-shaped) connectors, like a file-explorer or the
LaTeX tree:
- From each parent, a VERTICAL line runs down its left side spanning all its
  children.
- To each child, a short HORIZONTAL line branches off that vertical to meet the
  child block's left edge (an elbow / "└─" and "├─" shape).
- Lines are thin, colour --hairline, clearly visible in both themes.
- The vertical for a parent stops at its LAST child (proper tree, not a full-height
  rail).
The reader must be able to trace, purely from the connector lines, that
analysis_type / domains[] / rigid_bodies[] / interfaces[] are children of
physical_analysis, etc.

### 13c. Horizontal indentation (INCREASE per level)
Each depth level indents notably MORE to the right than its parent — generous
horizontal spacing so children sit clearly to the right of their parent, matching
the User Guide PDF. Use a comfortable per-level indent (e.g. ~32-40px per depth
level, not a few px). Vertical spacing between blocks stays compact/normal; it is
only the HORIZONTAL indentation that increases. Children must never sit almost
under their parent — the offset must read clearly.

### 13d. Blocks
- Default blocks: neutral surface (--surface), 1px --hairline border, monospace
  label (--font-mono), small radius. Same neutral "white block" look in BOTH
  themes (dark: --surface fill, --hairline border, --text label).
- Highlighted block (the current chapter's): use the site's existing ORANGE
  accent token --hot (the orange from the hero/wordmark). Highlight = --hot border
  + faint --hot-tint fill + label colour that stays legible on that fill in BOTH
  themes. Add --map-highlight / --map-highlight-bg token pair mapping to the --hot
  family if needed for per-theme legibility. NOT pink, NOT teal, NOT maroon —
  the site orange (--hot).

### 13e. Interaction
Each block is a clickable wouter link to that block's chapter/page. Hover gives a
subtle affordance. The highlighted current block links to itself / does not
navigate.

### 13f. Component
One reusable component (InputMap) taking a `highlight` prop naming which block is
current, so every User Guide chapter drops it in with its own block highlighted.
Both themes, legible, real tree connectors, generous indentation.

## 14. Code surface contrast — CORRECTION to §12a (authoritative)

Earlier wording caused the dark-mode code panel to render DARKER than the page,
which is wrong. Correct rule:

- DARK theme: --code-bg must be slightly LIGHTER than the page background (--ink)
  — a gently raised panel (use a value at or just above --surface). It must be
  clearly distinct from the Note callout background but visually QUIETER / softer
  than a Note (lower saturation/contrast), NOT darker than the page. Never sink
  the code panel below the page background.
- LIGHT theme: --code-bg is a slightly darker/greyer inset than the page and
  MORE pronounced than the Note background (a distinct framed panel).

In both themes: code panel clearly different from Note, code text WCAG-AA legible.
The intent is a calm raised code well in dark mode, a framed inset in light mode.

## 15. Code surface + YAML-tree guide-lines — FURTHER TUNING (amends §14/§12b)

### 15a. --code-bg values (current, authoritative)
- LIGHT theme: light grey at 15% transparency over the page:
  --code-bg: rgba(71,85,105,0.15); --code-border: var(--hairline).
- DARK theme: a bit lighter than plain --surface, still short of the Note
  background so it stays quieter than a Note:
  --code-bg: #131921; --code-border: var(--hairline).
Applies to CodeBlock and YamlTree, both themes, per §12a/§14.

### 15b. YAML-tree indentation guide-lines — colour (supersedes the
--hairline + opacity approach in §12b)
--hairline was too close to --code-bg to read clearly. Guide-lines now use
--text-dim (no opacity reduction) — the SAME colour as the "# comment" text
inside the block, in both themes:
- LIGHT theme: --text-dim reads as a dark grey line, clearly visible against
  the light --code-bg panel.
- DARK theme: --text-dim reads as a light grey line (matching comment colour
  exactly), clearly visible against the dark --code-bg panel.
Still one line per indentation level, aligned to the indent, YamlTree only
(not plain CodeBlock listings).

## 16. Captions are mandatory (see CLAUDE.md for the full rule)

Every table, figure, and code listing transcribed from a manual's .tex that
carries a real \caption{...} (tables/figures) or lstlisting caption={...} MUST
show that exact caption text on the site. Do not invent a caption where the
source has none, and do not invent a "Table N."/"Figure N." number that can't
be verified from source alone — render the caption prose itself, unnumbered,
rather than guess a number.

## 15. Captions, numbering & figure/table/code conventions (authoritative)

EVERY table, figure, code listing (full input.i or any snippet), and boxed list
taken from the manuals MUST carry a caption. No exceptions. Use the EXACT caption
text from the source .tex file. Do not invent, shorten, or paraphrase captions.

Numbering — follow the manual's scheme (chapter-based): "Figure N.M", "Table N.M",
"Listing N.M" where N is the chapter number and M increments within the chapter.
Examples: Figure 1.1, Figure 1.2, Table 4.1, Listing 2.3. Number in source order.

Position (matches LaTeX convention):
- FIGURES and CODE BLOCKS/LISTINGS (including full input.i and snippets): caption
  goes BELOW the figure/code. Code blocks are treated as figures for captioning.
- TABLES and LISTINGS-as-tables: caption goes ABOVE the table.
- The caption LABEL ("Figure 1.2.", "Table 4.1.") is bold, sentence-case, followed
  by a period, then the caption text in --text-dim, small. (Matches manual's
  labelfont=bf, labelsep=period.)

## 16. Code block styling — boldness, indentation, surface, guide-lines (authoritative)

BOLDNESS: keywords in code blocks must be only GENTLY bold — a relaxed medium
weight like the manual, never heavy/black. Match the manual's listing weight
(restrained, easy on the eye). Furthermore, ONLY bold the tokens the manual bolds:
some keys are lightly emphasised, others are not bold at all. Follow the source
exactly — do not blanket-bold all keys.

INDENTATION (input.i correctness): YAML children must indent correctly. In
particular, all children of a list item under `- name: X` (e.g. type, location,
materials) align under the WORD "name", i.e. the same indentation as "name", NOT
under the dash "-". Reproduce the source file's indentation faithfully.

CODE SURFACE COLOUR:
- LIGHT theme: code panel is light grey at ~15% opacity tint over the page — a
  soft, distinct inset, more pronounced than a Note but gentle.
- DARK theme: code panel is a raised panel LIGHTER than the page background — and
  a bit lighter than the earlier attempt; clearly a lifted surface, still quieter
  than a Note, never darker than the page.

YAML-TREE / CODE INDENT GUIDE-LINES (visibility fix): the vertical indentation
guide-lines must be clearly visible:
- LIGHT theme: guide lines are DARK grey.
- DARK theme: guide lines are LIGHT grey — the SAME colour as the code comments
  (# ...) in dark mode.
Visible but not loud, in both themes.

## 17. BASH command block strip

Bash/shell command blocks have a top strip (the bar holding the "BASH" label and
copy icon). That strip must differ from the command body:
- LIGHT theme: strip is 2 shades DARKER than the command-body background.
- DARK theme: strip is 2 shades LIGHTER than the command-body background.
This applies to all shell/bash command blocks site-wide.

## 18. Tables — header fill & fonts (authoritative; supersedes §4 colours)

Header row is COLOUR-FILLED (not just a surface tint):
- LIGHT theme: header fill = the HSLU slate colour used in the manuals
  (hsluslate #1F3A5F family); header text = WHITE.
- DARK theme: header fill = that same HSLU slate but 3 SHADES LIGHTER so it reads
  on the dark page; header text = WHITE.
Header row only — still NO zebra striping on body rows (per §4).

FONTS in tables: cell text uses the site body font (Source Serif 4). EXCEPTION:
any cell whose content is an input.i keyword/option/value uses the code font
(--font-mono, IBM Plex Mono) — exactly as the manuals render keys in \ttfamily
inside tables. So: prose in body font, keywords/values in mono.

These table rules apply to ALL chapters and ALL pages.
