# Cyberpunk RED Screamsheet Generator — Svelte Static / GitHub Pages Version V2

This package is ready to upload to GitHub Pages as a static site.

The root folder contains the usable app:

```text
index.html
css/
js/
Cyberpunk RED Logos/
README.md
```

You do **not** need to run `npm install`, `npm run dev`, or `npm run build` to use the app from GitHub Pages.

The Svelte source is included separately in:

```text
_svelte_source/
```

Only use that folder if you later want to edit the Svelte implementation and rebuild it yourself.

## Main features

- Same Screamsheet templates and block types as the vanilla version.
- Editable layouts: 1 column, 2 columns, 3 columns, sidebar left, sidebar right, feature split, and map + notes.
- Drag-and-drop block movement, plus move up/down fallback controls.
- Block span controls: normal, span 2 columns, full width, and compact/sidebar.
- Image upload and asset library, including article images, hero images, maps/diagrams, captions, and image fit controls.
- Font-size controls for selected blocks: body text and title text.
- Adaptive headline fitting so lead titles stay inside their column.
- Automatic overflow flow: long text is split into continuation blocks, moved into the next available column, and then into new pages when needed.
- Direct PDF download.
- Print fallback.
- Save/load project JSON.
- Browser autosave.

## GitHub Pages usage

1. Extract this zip.
2. Upload the root files and folders to your GitHub repository.
3. Enable GitHub Pages for that branch/folder.
4. Open the GitHub Pages URL.

Do not upload only `_svelte_source/`. That is source code, not the static deployment root.

## Overflow behavior

The editor automatically checks page height after edits. Splittable text blocks continue into another column where possible. If the current page cannot hold the continuation, the editor creates or uses the next page.

Image-heavy blocks, ads, warning boxes, and other compact visual blocks are moved as whole blocks when they cannot fit. If a block is too large to fit on a page, the editor marks the page with an overflow warning so you can reduce font size, image height, or block count.
