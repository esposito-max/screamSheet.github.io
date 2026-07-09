# Screamsheet Generator V10 — Svelte Pages-ready

This package is GitHub Pages-ready.

Upload the root files to GitHub Pages and open the Pages URL. No `npm install`, `npm run dev`, or `npm run build` is required to use the app.

The root `index.html` is the built/static app. `_svelte_source/` is included for future development reference.

## Core rules

- A new/template page is truly blank: the body starts with zero blocks and zero DOM placeholder blocks.
- Templates only change page chrome and guide overlays.
- Every user-created block is an independent canvas object with X/Y/W/H geometry.
- Moving/resizing affects only the selected block.
- No global reflow exists.
- Overflow checks are non-destructive.
- PDF export renders from a read-only state copy and does not mutate the editor.

## Tested

See `V10_TEST_REPORT.json`.
