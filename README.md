# Screamsheet Generator — Svelte Pages V3

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

## Main changes in V3

- Replaced the crowded top toolbar with a left sidebar.
- Sidebar tools are grouped into accordion sections:
  - Document
  - Pages & Templates
  - Page Layout
  - Add Blocks
  - Selected Block
  - Images
  - Markdown
  - Export & Files
- Added `Free layout` mode for granular block placement.
- Free-layout blocks can be dragged and resized with no-overlap collision checks.
- Added exact X/Y/W/H controls for selected free-layout blocks.
- Added snap-to-grid, lock/unlock, and z-order controls.
- Added automatic Markdown recognition on paste/blur.
- Added manual `Apply Markdown to Selection` command.
- Preserved PDF export, print fallback, project JSON save/load, image library, font-size controls, and newspaper overflow behavior.

## Layout modes

### Newspaper layouts

Use `1 column`, `2 columns`, `3 columns`, sidebar, feature, and map layouts for article-heavy pages. These support automatic overflow into later columns/pages.

### Free layout

Use `Free layout` for front pages, ad pages, maps, covers, and hand-tuned compositions. Blocks can be positioned manually. Text overflow is not automatically reflowed in this mode; resize the block or create another block.

## Markdown support

When `Auto-apply Markdown on paste/blur` is enabled, the editor recognizes headings, bold, italic, strike, inline code, links, bullets, numbered lists, and quote blocks. Markdown conversion is sanitized before insertion.

## Editing the Svelte source

Only needed if you want to change the source implementation:

```bash
cd _svelte_source
npm install
npm run build
```

For normal use through GitHub Pages, do not run those commands.
