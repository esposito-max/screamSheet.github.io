# Svelte Source — Screamsheet Generator V5

This folder contains the editable Svelte/Vite source. The repository root already contains the compiled GitHub Pages-ready static app.

To edit and rebuild the source:

```bash
npm install
npm run build
```

V5 includes the auto-flow duplication fix and keeps the root static build in parity with the vanilla package.


## V6 export stability note

The PDF export button is read-only: it no longer runs auto-flow or collision repair on the live editor document. If a browser blocks the direct raster renderer, the app falls back to a safe canvas/PDF renderer instead of mutating the working document. Print Fallback remains available for browser-native PDF printing.
