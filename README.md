# Screamsheet Generator — Svelte Pages V4

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

## Main changes in V4

- Granular block movement is now available in **all** layouts, not only `Free layout`.
- Layout presets now behave as starting guides/arrangements. They no longer prevent manual positioning.
- Any selected block can be:
  - dragged with the `☰` handle;
  - resized with the lower-right resize handle;
  - positioned by exact `X / Y / W / H` values;
  - snapped to grid;
  - locked/unlocked;
  - moved forward/backward in z-order.
- Collision checks apply to manual movement and resizing so blocks cannot be placed over each other.
- `Free layout` now also participates in auto-flow.
- Auto-flow now checks both page overflow and text overflow inside positioned blocks.
- Added a selected-block auto-flow toggle so specific blocks can opt out.
- Preserved the sidebar accordion UI, Markdown recognition, image controls, font-size controls, project JSON save/load, PDF export, and print fallback.

## Layout behavior

All layouts support manual arrangement. `1 column`, `2 columns`, `3 columns`, sidebar, feature, map, and `Free layout` control the initial structure and page guides, but individual blocks can still be moved and resized.

When auto-flow is enabled, long text continues into a continuation block. The app first tries to place the continuation into safe empty space on the same page; if there is no non-overlapping space, it creates or uses a following page.

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
