# Cyberpunk RED Screamsheet Generator — Svelte Source

This folder contains the Svelte/Vite source for the Screamsheet Generator.

The parent package already contains a GitHub Pages-ready static version at the root. You only need this source folder if you want to change the Svelte code and rebuild it.

## Requirements for source editing

- Node.js 18+
- npm

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The build output goes to `dist/`. For GitHub Pages project repositories, keep `base: './'` in `vite.config.js` so asset paths remain relative.

## Feature parity target

The Svelte source mirrors the static app's editor model:

- same templates;
- same block types;
- same image controls;
- same font-size controls;
- same automatic headline fitting;
- same overflow continuation behavior;
- same PDF export and project JSON format.
