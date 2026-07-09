# Screamsheet Generator — Svelte Pages V5

This package is GitHub Pages-ready. Upload the root folder contents to a GitHub repository and enable GitHub Pages. You do **not** need to run `npm install`, `npm run dev`, or `npm run build` to use the app.

The root files are the ready-to-serve static build:

```text
index.html
css/
js/
Cyberpunk RED Logos/
README.md
```

The `_svelte_source/` folder is included only for future development.

## V5 fixes

- Fixed the one-page auto-flow bug where the app could keep duplicating a block even when no visible overlap existed.
- Auto-flow now distinguishes between:
  - **text overflow inside a block**, which may create continuation blocks;
  - **physical page overflow**, which moves the whole block to the next safe page instead of splitting text unnecessarily.
- One-page documents are valid. If auto-flow genuinely needs more space, the app creates the next page safely.
- Svelte and Vanilla root builds now share the same static files and visible capabilities.

## Core capabilities

- Sidebar accordion UI.
- Night City Today-style Screamsheet templates.
- Add, duplicate, delete, drag, resize, and reorder blocks.
- Granular `X / Y / W / H` positioning in all layouts.
- Collision prevention for positioned blocks.
- Auto-flow in all layouts, including Free layout.
- Per-block auto-flow toggle.
- Font-size controls for title and body text.
- Markdown recognition and safe conversion.
- Image upload, asset library, image/map blocks, and image placement controls.
- Project save/load as JSON.
- Download PDF and print fallback.

## Editing the Svelte source

Only needed if you want to change the source implementation:

```bash
cd _svelte_source
npm install
npm run build
```

For normal use through GitHub Pages, do not run those commands.


## V6 export stability note

The PDF export button is read-only: it no longer runs auto-flow or collision repair on the live editor document. If a browser blocks the direct raster renderer, the app falls back to a safe canvas/PDF renderer instead of mutating the working document. Print Fallback remains available for browser-native PDF printing.
