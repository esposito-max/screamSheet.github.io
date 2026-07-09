<script>
  import { onMount } from 'svelte';

  onMount(() => {
    import('./lib/main.js');
  });
</script>

<div id="app-layout">
<aside aria-label="Screamsheet editor controls" class="editor-sidebar" id="editor-ui">
<div class="sidebar-brand">
<strong>SCREAMSHEET GENERATOR</strong>
<span>Cyberpunk RED static editor</span>
</div>
<details class="tool-section" open="">
<summary>Document</summary>
<label for="theme-select">Theme</label>
<select id="theme-select">
<option value="nct">Night City Today</option>
<option value="augmented-optic">Augmented Optic</option>
<option value="network54">Network54</option>
<option value="ncpd">NCPD Advisory</option>
<option value="trauma-team">Trauma Team</option>
<option value="arasaka">Arasaka</option>
<option value="militech">Militech</option>
<option value="biotechnica">Biotechnica</option>
<option value="mono">Blackline Generic</option>
</select>
<label for="page-size-select">PDF size</label>
<select id="page-size-select">
<option value="cyberpunk">Cyberpunk trim</option>
<option value="letter">US Letter</option>
<option value="a4">A4</option>
</select>
</details>
<details class="tool-section" open="">
<summary>Pages &amp; Templates</summary>
<label for="template-select">Template</label>
<select id="template-select">
<option value="nct-multi">NCT multi-article</option>
<option value="lead-sidebar">Lead story + sidebars</option>
<option value="product-ad">Ad / product page</option>
<option value="public-advisory">Public advisory</option>
<option value="interview">Interview / Q&amp;A</option>
<option value="mission-cover">Mission cover</option>
<option value="gm-scenario">GM scenario page</option>
<option value="map-diagram">Map / diagram page</option>
<option value="stat-encounter">Stat / encounter page</option>
<option value="blank">Blank page</option>
</select>
<button id="add-template-page-btn" type="button">Add Page</button>
</details>
<details class="tool-section" open="">
<summary>Page Layout</summary>
<label for="layout-select">Selected layout</label>
<select id="layout-select">
<option value="grid-1">1 column</option>
<option value="grid-2">2 columns</option>
<option value="grid-3">3 columns</option>
<option value="grid-sidebar-left">Sidebar left</option>
<option value="grid-sidebar-right">Sidebar right</option>
<option value="grid-feature">Feature split</option>
<option value="grid-map">Map + notes</option>
<option value="free-layout">Free layout</option>
</select>
<div class="sidebar-button-row">
<button id="apply-layout-btn" type="button">Apply Layout</button>
<button id="add-section-btn" type="button">Add Section</button>
</div>
<label class="inline-check"><input checked="" id="auto-flow-toggle" type="checkbox"/> Auto overflow in newspaper layouts</label>
<button id="reflow-now-btn" type="button">Reflow Now</button>
</details>
<details class="tool-section" open="">
<summary>Add Blocks</summary>
<label for="block-select">Block type</label>
<select id="block-select">
<option value="article">Article</option>
<option value="lead">Lead article</option>
<option value="briefs">Briefs list</option>
<option value="ad">Advertisement</option>
<option value="warning">Warning box</option>
<option value="pullquote">Pull quote</option>
<option value="links">Links</option>
<option value="image">Image / map</option>
<option value="photo-article">Photo article</option>
<option value="hero-image">Hero image</option>
<option value="qa">Q&amp;A section</option>
<option value="stat">Stat block</option>
<option value="timeline">Timeline</option>
</select>
<button class="primary" id="add-block-btn" type="button">Add Block</button>
</details>
<details class="tool-section" open="">
<summary>Selected Block</summary>
<label for="span-select">Column span</label>
<select id="span-select">
<option value="span-1">Normal span</option>
<option value="span-2">Span 2 columns</option>
<option value="span-all">Full width</option>
<option value="span-compact">Compact/sidebar</option>
</select>
<div class="sidebar-button-row">
<button id="apply-span-btn" type="button">Apply Span</button>
<button id="move-up-btn" type="button">↑</button>
<button id="move-down-btn" type="button">↓</button>
<button id="duplicate-block-btn" type="button">Duplicate</button>
</div>
<label for="body-font-size-input">Font size</label>
<div class="compact-grid two-cols">
<span>Body</span>
<input aria-label="Body font size in pixels" id="body-font-size-input" max="32" min="8" step="1" type="number" value="14"/>
<span>Title</span>
<input aria-label="Title font size in pixels" id="title-font-size-input" max="88" min="12" step="1" type="number" value="25"/>
</div>
<div class="sidebar-button-row">
<button id="apply-font-size-btn" type="button">Apply Font</button>
<button id="font-smaller-btn" type="button">A−</button>
<button id="font-larger-btn" type="button">A+</button>
</div>
<label>Free layout geometry</label>
<div class="compact-grid four-cols">
<span>X</span><input id="block-x-input" min="0" step="1" type="number" value="44"/>
<span>Y</span><input id="block-y-input" min="0" step="1" type="number" value="120"/>
<span>W</span><input id="block-w-input" min="80" step="1" type="number" value="280"/>
<span>H</span><input id="block-h-input" min="60" step="1" type="number" value="180"/>
</div>
<div class="sidebar-button-row">
<button id="apply-position-btn" type="button">Apply Box</button>
<button id="bring-forward-btn" type="button">Forward</button>
<button id="send-backward-btn" type="button">Backward</button>
</div>
<label class="inline-check"><input checked="" id="snap-grid-toggle" type="checkbox"/> Snap to grid</label>
<label class="inline-check"><input id="lock-block-toggle" type="checkbox"/> Lock selected block</label>
</details>
<details class="tool-section">
<summary>Images</summary>
<label for="image-fit-select">Image fit</label>
<select id="image-fit-select">
<option value="contain">Contain</option>
<option value="cover">Cover</option>
<option value="stretch">Stretch</option>
</select>
<label for="image-position-select">Image position</label>
<select aria-label="Image position" id="image-position-select">
<option value="image-pos-top">Top image</option>
<option value="image-pos-left">Left wrap</option>
<option value="image-pos-right">Right wrap</option>
<option value="image-pos-hero">Hero/background</option>
</select>
<div class="sidebar-button-row">
<button id="add-image-to-block-btn" type="button">Add Image Slot</button>
<button id="apply-image-fit-btn" type="button">Apply Image</button>
<button id="asset-library-btn" type="button">Assets</button>
</div>
</details>
<details class="tool-section">
<summary>Markdown</summary>
<label class="inline-check"><input checked="" id="auto-markdown-toggle" type="checkbox"/> Auto-apply Markdown on paste/blur</label>
<button id="apply-markdown-btn" type="button">Apply Markdown to Selection</button>
<p class="tool-hint">Recognizes headings, bold, italic, strike, inline code, links, bullets, and numbered lists.</p>
</details>
<details class="tool-section" open="">
<summary>Export &amp; Files</summary>
<div class="sidebar-button-row vertical">
<button id="save-project-btn" type="button">Save Project JSON</button>
<label class="file-button" for="load-project-input">Load Project JSON</label>
<input accept="application/json,.json" id="load-project-input" type="file"/>
<button class="primary" id="download-pdf-btn" type="button">Download PDF</button>
<button id="print-btn" type="button">Print Fallback</button>
</div>
</details>
</aside>
<main aria-label="Screamsheet pages" id="document-container"></main>
</div>
<aside aria-hidden="true" aria-label="Asset library" class="modal" id="asset-modal">
<div class="modal-card">
<div class="modal-header">
<div>
<h2>Asset Library</h2>
<p>Select a target image slot first, then choose an asset.</p>
</div>
<button aria-label="Close asset library" id="asset-modal-close" type="button">×</button>
</div>
<div class="asset-upload-row">
<label class="file-button" for="asset-upload-input">Upload Images</label>
<input accept="image/*" id="asset-upload-input" multiple="" type="file"/>
<button id="clear-uploaded-assets-btn" type="button">Clear Uploaded Assets</button>
</div>
<div class="asset-library-grid" id="asset-library-grid"></div>
</div>
</aside>
<div aria-live="polite" id="export-status" role="status"></div>
<template id="page-template">
<section class="sheet-page" data-page-number="1" data-theme="nct">
<button class="page-remove control-only" title="Remove page" type="button">×</button>
<div class="top-device-bar">
<img alt="signal icon" class="device-icon image-slot" data-image-role="icon" src="./Cyberpunk RED Logos/satellite dish.png"/>
<span class="editable timestamp" contenteditable="true" data-placeholder="Time">3:56 PM</span>
<img alt="battery icon" class="device-icon image-slot" data-image-role="icon" src="./Cyberpunk RED Logos/Eletric plug.png"/>
</div>
<header class="sheet-header">
<div class="masthead-wrap">
<div aria-label="Change masthead image" class="masthead image-drop-target" role="button" tabindex="0">
<img alt="Screamsheet masthead" class="masthead-logo image-slot" data-image-role="masthead" src="./Cyberpunk RED Logos/Night City Today News Logo.png"/>
<span class="drop-label">Masthead</span>
</div>
<nav aria-label="Screamsheet categories" class="category-grid">
<button class="category-chip" type="button">GOSSIP</button>
<button class="category-chip" type="button">OPINION</button>
<button class="category-chip" type="button">WEATHER</button>
<button class="category-chip" type="button">TECH</button>
<button class="category-chip" type="button">LIFESTYLE</button>
<button class="category-chip" type="button">LOCAL</button>
<button class="category-chip active" type="button">BUSINESS</button>
<button class="category-chip" type="button">WORLD</button>
</nav>
</div>
<div class="issue-bar">
<span class="editable" contenteditable="true" data-placeholder="Outlet">Night City Today</span>
<span class="editable" contenteditable="true" data-placeholder="Issue">Issue 2045-07</span>
<span class="editable" contenteditable="true" data-placeholder="Edition">Agent Edition</span>
</div>
</header>
<div class="sheet-body"></div>
<footer class="sheet-footer">
<span class="editable footer-copy" contenteditable="true" data-placeholder="Footer">Night City Today News // Your Data. Your Truth.</span>
<strong class="page-number">1</strong>
</footer>
</section>
</template>
