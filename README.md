# Screamsheet Generator V11 — Svelte Pages Package

This package is GitHub Pages-ready. The root `index.html` is the usable static app.

## Use on GitHub Pages

Upload the root contents of this package to the repository served by GitHub Pages. No `npm install`, `npm run dev`, or `npm run build` is needed to use the app.

## Source note

`_svelte_source/` is included only as a development placeholder. The working app is the static root build.

## V11 rebuild notes

- Clean canvas architecture: every block is an independent positioned object.
- Templates are blank: they create page chrome and guide overlays only, never body blocks.
- No global reflow and no destructive automatic pagination.
- Optional visual guide overlays: blank, two columns, three columns, feature split, map + notes, grid.
- Screamsheet-fidelity chrome for Night City Today, The Augmented Optic, Public Advisory, Mission Packet, and Minimal Print.
- Styled blocks: Lead, Article, Briefs, Ad, Warning, Pull Quote, Image, Map, Q&A, Timeline, Stat, Links.
- Markdown conversion for text blocks.
- Font-size controls, X/Y/W/H geometry, z-order, lock, duplicate, delete.
- PDF export renders from state and does not mutate the editor.
- Uses `sgV11` localStorage key so old broken V-series drafts are not loaded automatically.

## Tested

See `V11_TEST_REPORT.json`.
