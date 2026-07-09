<script>
  import { ASSET_LIBRARY, DEFAULT_ASSETS } from './lib/assets.js';
  import { createBlock, createPageBody } from './lib/templates.js';
  import { PAGE_SIZES, downloadPagesAsPdf } from './lib/pdf-export.js';
  import { readUserAssets, writeUserAssets, clearUserAssets, downloadJson, fileToDataUrl, saveAutosave, readAutosave } from './lib/storage.js';
  import { onMount } from 'svelte';

  let container;
  let assetUploadInput;
  let theme = 'nct';
  let templateName = 'nct-multi';
  let pageSize = 'cyberpunk';
  let blockType = 'article';
  let layoutClass = 'grid-1';
  let spanClass = 'span-1';
  let imageFit = 'contain';
  let imagePosition = 'image-pos-top';
  let bodyFontSize = 14;
  let titleFontSize = 25;
  let autoFlow = true;
  let modalOpen = false;
  let status = '';
  let documentHtml = '';

  let activePage = null;
  let activeBlock = null;
  let activeGrid = null;
  let imageTarget = null;
  let draggedBlock = null;
  let autosaveTimer = null;
  let layoutMaintenanceTimer = null;
  let isPaginating = false;
  let lastFocusedEditable = null;
  let userAssets = {};

  const themes = [
    ['nct', 'Night City Today'], ['augmented-optic', 'Augmented Optic'], ['network54', 'Network54'], ['ncpd', 'NCPD Advisory'],
    ['trauma-team', 'Trauma Team'], ['arasaka', 'Arasaka'], ['militech', 'Militech'], ['biotechnica', 'Biotechnica'], ['mono', 'Blackline Generic']
  ];
  const templates = [
    ['nct-multi', 'NCT multi-article'], ['lead-sidebar', 'Lead story + sidebars'], ['product-ad', 'Ad / product page'],
    ['public-advisory', 'Public advisory'], ['interview', 'Interview / Q&A'], ['mission-cover', 'Mission cover'],
    ['gm-scenario', 'GM scenario page'], ['map-diagram', 'Map / diagram page'], ['stat-encounter', 'Stat / encounter page'], ['blank', 'Blank page']
  ];
  const blockTypes = [
    ['article', 'Article'], ['lead', 'Lead article'], ['briefs', 'Briefs list'], ['ad', 'Advertisement'], ['warning', 'Warning box'],
    ['pullquote', 'Pull quote'], ['links', 'Links'], ['image', 'Image / map'], ['photo-article', 'Photo article'], ['hero-image', 'Hero image'],
    ['qa', 'Q&A section'], ['stat', 'Stat block'], ['timeline', 'Timeline']
  ];
  const layouts = [
    ['grid-1', '1 column'], ['grid-2', '2 columns'], ['grid-3', '3 columns'], ['grid-sidebar-left', 'Sidebar left'],
    ['grid-sidebar-right', 'Sidebar right'], ['grid-feature', 'Feature split'], ['grid-map', 'Map + notes']
  ];
  const spans = [['span-1', 'Normal span'], ['span-2', 'Span 2 columns'], ['span-all', 'Full width'], ['span-compact', 'Compact/sidebar']];

  onMount(() => {
    const draft = readAutosave();
    userAssets = readUserAssets();
    if (draft?.html && confirm('Restore the autosaved screamsheet draft from this browser?')) documentHtml = sanitizeProjectHtml(draft.html);
    else documentHtml = createPageHtml('nct-multi');
    queueMicrotask(() => {
      hydrateDocument();
      updatePageSize(pageSize);
      setActivePage(container.querySelector('.sheet-page'));
    });
  });

  function createPageHtml(name) {
    const pageNo = container ? container.querySelectorAll('.sheet-page').length + 1 : 1;
    const gmClass = name === 'gm-scenario' || name === 'stat-encounter' ? ' gm-page-mode' : '';
    return `<section class="sheet-page${gmClass}" data-theme="${theme}" data-page-number="${pageNo}" data-page-size="${pageSize}">
      <button class="page-remove control-only" type="button" title="Remove page">×</button>
      <div class="top-device-bar">
        <img class="device-icon image-slot" data-image-role="icon" alt="signal icon" src="./Cyberpunk RED Logos/satellite dish.png" />
        <span class="editable timestamp" contenteditable="true" data-placeholder="Time">3:56 PM</span>
        <img class="device-icon image-slot" data-image-role="icon" alt="battery icon" src="./Cyberpunk RED Logos/Eletric plug.png" />
      </div>
      <header class="sheet-header">
        <div class="masthead-wrap">
          <div class="masthead image-drop-target" tabindex="0" role="button" aria-label="Change masthead image">
            <img class="masthead-logo image-slot" data-image-role="masthead" alt="Screamsheet masthead" src="${mastheadForTheme(theme)}" />
            <span class="drop-label">Masthead</span>
          </div>
          <nav class="category-grid" aria-label="Screamsheet categories">
            ${['GOSSIP','OPINION','WEATHER','TECH','LIFESTYLE','LOCAL','BUSINESS','WORLD'].map((label, i) => `<button type="button" class="category-chip ${i === 6 ? 'active' : ''}">${label}</button>`).join('')}
          </nav>
        </div>
        <div class="issue-bar">
          <span class="editable" contenteditable="true" data-placeholder="Outlet">Night City Today</span>
          <span class="editable" contenteditable="true" data-placeholder="Issue">Issue 2045-07</span>
          <span class="editable" contenteditable="true" data-placeholder="Edition">Agent Edition</span>
        </div>
      </header>
      <div class="sheet-body">${createPageBody(name)}</div>
      <footer class="sheet-footer">
        <span class="editable footer-copy" contenteditable="true" data-placeholder="Footer">Night City Today News // Your Data. Your Truth.</span>
        <strong class="page-number">${pageNo}</strong>
      </footer>
    </section>`;
  }

  function mastheadForTheme(name) {
    return ({
      nct: DEFAULT_ASSETS.nctLogo,
      'augmented-optic': DEFAULT_ASSETS.augmentedOpticLogo,
      network54: DEFAULT_ASSETS.network54Logo,
      ncpd: DEFAULT_ASSETS.ncpd,
      'trauma-team': DEFAULT_ASSETS.traumaTeam,
      arasaka: DEFAULT_ASSETS.arasaka,
      militech: DEFAULT_ASSETS.militech,
      biotechnica: DEFAULT_ASSETS.biotechnica,
      mono: DEFAULT_ASSETS.nctLogoBlack
    })[name] || DEFAULT_ASSETS.nctLogo;
  }

  function hydrateDocument() {
    if (!container) return;
    container.querySelectorAll('.sheet-page').forEach(page => {
      page.querySelectorAll('.block').forEach(block => {
        block.setAttribute('draggable', 'false');
        if (!block.querySelector('.block-drag')) {
          const drag = document.createElement('button');
          drag.className = 'block-drag control-only';
          drag.type = 'button';
          drag.draggable = true;
          drag.title = 'Drag block';
          drag.setAttribute('aria-label', 'Drag block');
          drag.textContent = '☰';
          block.prepend(drag);
        }
      });
      page.querySelectorAll('.sheet-grid, .sheet-body').forEach(grid => grid.classList.add('drop-container'));
    });
  }

  function addTemplatePage() {
    container.insertAdjacentHTML('beforeend', createPageHtml(templateName));
    hydrateDocument();
    updatePageNumbers();
    setActivePage(container.querySelector('.sheet-page:last-child'));
    queueAutosave();
  }

  function setActivePage(page) {
    if (!page) return;
    container.querySelectorAll('.active-page').forEach(p => p.classList.remove('active-page'));
    activePage = page;
    activePage.classList.add('active-page');
    theme = activePage.dataset.theme || theme;
    if (!activeGrid || !activePage.contains(activeGrid)) setActiveGrid(activePage.querySelector('.sheet-body'));
  }

  function setActiveBlock(block) {
    container.querySelectorAll('.selected-block').forEach(el => el.classList.remove('selected-block'));
    activeBlock = block;
    if (!block) return;
    block.classList.add('selected-block');
    const parent = block.parentElement?.closest('.sheet-grid, .sheet-body');
    if (parent) setActiveGrid(parent);
    spanClass = Array.from(block.classList).find(cls => cls.startsWith('span-')) || 'span-1';
    syncFontControlsFromBlock(block);
  }

  function setActiveGrid(grid) {
    if (!grid) return;
    container.querySelectorAll('.selected-grid').forEach(el => el.classList.remove('selected-grid'));
    activeGrid = grid;
    activeGrid.classList.add('selected-grid');
    layoutClass = Array.from(grid.classList).find(cls => cls.startsWith('grid-')) || 'grid-1';
  }

  function handleDocumentClick(event) {
    const page = event.target.closest('.sheet-page');
    if (page) setActivePage(page);
    const removePage = event.target.closest('.page-remove');
    if (removePage) return removePageElement(removePage.closest('.sheet-page'));
    const removeBlock = event.target.closest('.block-remove');
    if (removeBlock) return removeBlockElement(removeBlock.closest('.block'));
    const chip = event.target.closest('.category-chip');
    if (chip) {
      chip.closest('.category-grid').querySelectorAll('.category-chip').forEach(btn => btn.classList.remove('active'));
      chip.classList.add('active');
      return queueAutosave();
    }
    const target = event.target.closest('.image-drop-target');
    if (target) {
      const block = target.closest('.block');
      if (block) setActiveBlock(block);
      imageTarget = target;
      container.querySelectorAll('.targeting').forEach(el => el.classList.remove('targeting'));
      imageTarget.classList.add('targeting');
      modalOpen = true;
      return;
    }
    const block = event.target.closest('.block');
    if (block) setActiveBlock(block);
    else {
      const grid = event.target.closest('.sheet-grid, .sheet-body');
      if (grid) setActiveGrid(grid);
    }
  }

  function removePageElement(page) {
    if (container.querySelectorAll('.sheet-page').length <= 1) return alert('The document must keep at least one page.');
    page.remove();
    updatePageNumbers();
    setActivePage(container.querySelector('.sheet-page'));
    queueAutosave();
  }

  function removeBlockElement(block) {
    if (!block) return;
    block.remove();
    if (block === activeBlock) activeBlock = null;
    queueAutosave();
  }

  function addSelectedBlock() {
    if (!activePage) setActivePage(container.querySelector('.sheet-page'));
    const target = activeGrid && activePage?.contains(activeGrid) ? activeGrid : activePage.querySelector('.sheet-body');
    target.insertAdjacentHTML('beforeend', createBlock(blockType));
    hydrateDocument();
    setActiveBlock(target.querySelector('.block:last-of-type'));
    queueAutosave();
  }

  function applySelectedLayout() {
    if (!activePage) return;
    const target = activeGrid && activePage.contains(activeGrid) ? activeGrid : activePage.querySelector('.sheet-body');
    target.classList.remove('grid-1', 'grid-2', 'grid-3', 'grid-sidebar-left', 'grid-sidebar-right', 'grid-feature', 'grid-bottom-cards', 'grid-map');
    target.classList.add('sheet-grid', layoutClass);
    setActiveGrid(target);
    queueAutosave();
  }

  function addLayoutSection() {
    const section = document.createElement('section');
    section.className = `sheet-grid drop-container ${layoutClass}`;
    section.innerHTML = createBlock(blockType || 'article');
    activePage.querySelector('.sheet-body').appendChild(section);
    hydrateDocument();
    setActiveGrid(section);
    setActiveBlock(section.querySelector('.block'));
    queueAutosave();
  }

  function applySelectedSpan() {
    if (!activeBlock) return;
    activeBlock.classList.remove('span-1', 'span-2', 'span-all', 'span-compact');
    activeBlock.classList.add(spanClass);
    queueAutosave();
  }

  function moveActiveBlock(direction) {
    if (!activeBlock) return;
    const sibling = direction < 0 ? activeBlock.previousElementSibling : activeBlock.nextElementSibling;
    if (!sibling) return;
    if (direction < 0) activeBlock.parentElement.insertBefore(activeBlock, sibling);
    else activeBlock.parentElement.insertBefore(sibling, activeBlock);
    queueAutosave();
  }

  function duplicateActiveBlock() {
    if (!activeBlock) return;
    const clone = activeBlock.cloneNode(true);
    clone.classList.remove('selected-block', 'dragging');
    activeBlock.after(clone);
    hydrateDocument();
    setActiveBlock(clone);
    queueAutosave();
  }

  function addImageSlotToActiveBlock() {
    if (!activeBlock) return;
    const frame = document.createElement('div');
    frame.className = 'image-frame inline-image image-drop-target contain';
    frame.tabIndex = 0;
    frame.innerHTML = '<span class="empty-label">Click to add image</span><img class="image-slot" data-image-role="inline" alt="Inline image" hidden />';
    const caption = document.createElement('p');
    caption.className = 'caption editable';
    caption.contentEditable = 'true';
    caption.dataset.placeholder = 'Caption';
    caption.textContent = 'Image caption / source line.';
    const body = activeBlock.querySelector('.article-body');
    if (body) { body.before(caption); caption.before(frame); }
    else activeBlock.append(frame, caption);
    activeBlock.classList.remove('image-pos-left', 'image-pos-right', 'image-pos-hero');
    activeBlock.classList.add('image-pos-top');
    imageTarget = frame;
    modalOpen = true;
    queueAutosave();
  }

  function applyImageOptions() {
    const targetBlock = activeBlock || imageTarget?.closest('.block');
    const frames = imageTarget ? [imageTarget] : Array.from(targetBlock?.querySelectorAll('.image-frame, .hero-card') || []);
    frames.forEach(frame => {
      frame.classList.remove('contain', 'cover', 'stretch');
      frame.classList.add(imageFit);
    });
    if (targetBlock) {
      targetBlock.classList.remove('image-pos-top', 'image-pos-left', 'image-pos-right', 'image-pos-hero');
      targetBlock.classList.add(imagePosition);
    }
    queueAutosave();
  }

  function selectAsset(src, name) {
    if (!imageTarget) return alert('Select an image slot on the page first.');
    let img = imageTarget.querySelector('img.image-slot');
    if (!img && imageTarget.matches('img.image-slot')) img = imageTarget;
    if (!img) return;
    img.src = src;
    img.alt = name || 'Selected asset';
    img.hidden = false;
    const empty = imageTarget.querySelector('.empty-label');
    if (empty) empty.style.display = 'none';
    modalOpen = false;
    imageTarget.classList.remove('targeting');
    imageTarget = null;
    queueAutosave();
  }

  async function handleAssetUpload(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    try {
      const uploaded = await Promise.all(files.map(fileToDataUrl));
      const assets = readUserAssets();
      assets.Uploads = [...(assets.Uploads || []), ...uploaded];
      writeUserAssets(assets);
      userAssets = readUserAssets();
    } catch (error) {
      alert(error.message || 'Could not upload the selected assets.');
    } finally {
      event.target.value = '';
    }
  }

  function clearUploads() {
    if (!confirm('Delete all uploaded assets stored in this browser?')) return;
    clearUserAssets();
    userAssets = {};
  }

  function handleDragStart(event) {
    const handle = event.target.closest('.block-drag');
    const block = handle?.closest('.block');
    if (!block) return event.preventDefault();
    draggedBlock = block;
    setActiveBlock(block);
    block.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', 'screamsheet-block');
  }

  function handleDragOver(event) {
    if (!draggedBlock) return;
    const container = getDropContainer(event.target);
    if (!container || draggedBlock.contains(container)) return;
    event.preventDefault();
    container.classList.add('drag-over');
  }

  function handleDrop(event) {
    if (!draggedBlock) return;
    const target = getDropContainer(event.target);
    container.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
    if (!target || draggedBlock.contains(target)) return;
    event.preventDefault();
    const after = getBlockAfterPointer(target, event.clientY);
    if (after) target.insertBefore(draggedBlock, after);
    else target.appendChild(draggedBlock);
    setActiveGrid(target);
    setActiveBlock(draggedBlock);
    queueAutosave();
  }

  function handleDragEnd() {
    draggedBlock?.classList.remove('dragging');
    draggedBlock = null;
    container?.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
  }

  function getDropContainer(target) {
    const block = target.closest?.('.block');
    if (block?.parentElement?.matches('.sheet-grid, .sheet-body')) return block.parentElement;
    return target.closest?.('.sheet-grid, .sheet-body') || null;
  }

  function getBlockAfterPointer(target, y) {
    const blocks = Array.from(target.children).filter(el => el.classList?.contains('block') && el !== draggedBlock);
    let closest = { offset: Number.NEGATIVE_INFINITY, element: null };
    blocks.forEach(block => {
      const box = block.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) closest = { offset, element: block };
    });
    return closest.element;
  }

  function handlePlainTextPaste(event) {
    const editable = event.target.closest('[contenteditable="true"]');
    if (!editable) return;
    event.preventDefault();
    const text = (event.clipboardData || window.clipboardData).getData('text/plain');
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;
    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(document.createTextNode(text));
    selection.collapseToEnd();
  }

  function applyTheme() {
    if (!activePage) return;
    activePage.dataset.theme = theme;
    const img = activePage.querySelector('.masthead-logo');
    if (img) img.src = mastheadForTheme(theme);
    queueAutosave();
  }

  function updatePageSize(name) {
    const size = PAGE_SIZES[name] || PAGE_SIZES.cyberpunk;
    document.documentElement.style.setProperty('--page-w', `${size.cssWidth}px`);
    document.documentElement.style.setProperty('--page-h', `${size.cssHeight}px`);
    container?.querySelectorAll('.sheet-page').forEach(page => page.dataset.pageSize = name);
    let style = document.getElementById('dynamic-print-page-size');
    if (!style) {
      style = document.createElement('style');
      style.id = 'dynamic-print-page-size';
      document.head.appendChild(style);
    }
    style.textContent = `@page { size: ${size.pdfWidth}pt ${size.pdfHeight}pt; margin: 0; }`;
    queueAutosave();
  }

  function updatePageNumbers() {
    container.querySelectorAll('.sheet-page').forEach((page, index) => {
      page.dataset.pageNumber = `${index + 1}`;
      const n = page.querySelector('.page-number');
      if (n) n.textContent = `${index + 1}`;
    });
  }

  function buildProjectData() {
    return { app: 'cyberpunk-red-screamsheet-generator-svelte', version: 1, savedAt: new Date().toISOString(), pageSize, activeTheme: theme, html: container?.innerHTML || documentHtml };
  }

  function saveProject() {
    downloadJson(`screamsheet-svelte-project-${new Date().toISOString().slice(0, 10)}.json`, buildProjectData());
  }

  async function loadProjectFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (typeof data.html !== 'string') throw new Error('Missing html');
      pageSize = data.pageSize && PAGE_SIZES[data.pageSize] ? data.pageSize : 'cyberpunk';
      documentHtml = sanitizeProjectHtml(data.html);
      queueMicrotask(() => { hydrateDocument(); updatePageSize(pageSize); updatePageNumbers(); setActivePage(container.querySelector('.sheet-page')); });
    } catch {
      alert('The selected file is not a valid Screamsheet project JSON.');
    } finally {
      event.target.value = '';
    }
  }

  function sanitizeProjectHtml(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<main>${html}</main>`, 'text/html');
    doc.querySelectorAll('script, iframe, object, embed, link, meta, style, form').forEach(el => el.remove());
    doc.querySelectorAll('*').forEach(el => {
      Array.from(el.attributes).forEach(attr => {
        const name = attr.name.toLowerCase();
        const value = attr.value || '';
        if (name.startsWith('on')) el.removeAttribute(attr.name);
        if ((name === 'href' || name === 'src') && /^javascript:/i.test(value)) el.removeAttribute(attr.name);
      });
      el.classList.remove('selected-block', 'selected-grid', 'dragging', 'drag-over', 'flow-warning');
    });
    doc.querySelectorAll('.flow-note').forEach(el => el.remove());
    return doc.querySelector('main').innerHTML;
  }

  function applyFontSizeOptions() {
    const target = activeBlock || lastFocusedEditable?.closest('.block');
    if (!target) return;
    bodyFontSize = clampNumber(Number(bodyFontSize), 8, 32, 14);
    titleFontSize = clampNumber(Number(titleFontSize), 12, 88, 25);
    target.style.setProperty('--block-font-size', `${bodyFontSize}px`);
    target.style.setProperty('--title-font-size', `${titleFontSize}px`);
    target.style.setProperty('--lead-title-font-size', `${Math.max(titleFontSize, Math.round(titleFontSize * 1.8))}px`);
    target.dataset.bodyFontSize = String(bodyFontSize);
    target.dataset.titleFontSize = String(titleFontSize);
    queueAutosave();
  }

  function stepSelectedFontSize(delta) {
    const target = activeBlock || lastFocusedEditable?.closest('.block');
    if (!target) return;
    syncFontControlsFromBlock(target);
    bodyFontSize = clampNumber(Number(bodyFontSize) + delta, 8, 32, 14);
    titleFontSize = clampNumber(Number(titleFontSize) + delta * 2, 12, 88, 25);
    applyFontSizeOptions();
  }

  function syncFontControlsFromBlock(block) {
    if (!block) return;
    const computed = getComputedStyle(block);
    const body = parseFloat(block.dataset.bodyFontSize || computed.getPropertyValue('--block-font-size')) || 14;
    const title = parseFloat(block.dataset.titleFontSize || computed.getPropertyValue('--title-font-size')) || (block.classList.contains('lead-block') ? 52 : 25);
    bodyFontSize = Math.round(clampNumber(body, 8, 32, 14));
    titleFontSize = Math.round(clampNumber(title, 12, 88, 25));
  }

  function clampNumber(value, min, max, fallback) {
    if (!Number.isFinite(value)) return fallback;
    return Math.min(max, Math.max(min, value));
  }

  function queueAutosave() {
    queueLayoutMaintenance();
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => saveAutosave(buildProjectData()), 900);
  }

  function queueLayoutMaintenance() {
    clearTimeout(layoutMaintenanceTimer);
    layoutMaintenanceTimer = setTimeout(() => runLayoutMaintenance(), 260);
  }

  function runLayoutMaintenance({ forcePagination = false } = {}) {
    fitHeadlines(container || document);
    if (forcePagination || autoFlow) paginateOverflow();
    updatePageNumbers();
  }

  function fitHeadlines(root = document) {
    const titles = root.querySelectorAll('.lead-article h1, .article h2, .hero-overlay h2, .mission-cover h1');
    titles.forEach(title => {
      const block = title.closest('.block');
      const computedBlock = block ? getComputedStyle(block) : getComputedStyle(title);
      const base = parseFloat(block?.dataset.titleFontSize || computedBlock.getPropertyValue('--title-font-size')) || parseFloat(getComputedStyle(title).fontSize) || 25;
      const multiplier = title.matches('.lead-article h1, .mission-cover h1') ? 1.85 : title.matches('.hero-overlay h2') ? 1.35 : 1;
      const maxSize = clampNumber(base * multiplier, 14, title.matches('.lead-article h1, .mission-cover h1') ? 88 : 54, 25);
      const minSize = title.matches('.lead-article h1, .mission-cover h1') ? 24 : 14;
      title.style.fontSize = `${maxSize}px`;
      title.style.overflowWrap = 'anywhere';
      title.style.maxWidth = '100%';
      let size = maxSize;
      let guard = 0;
      while (guard < 40 && size > minSize && title.scrollWidth > title.clientWidth + 1) {
        size -= 1.5;
        title.style.fontSize = `${size}px`;
        guard += 1;
      }
    });
  }

  function paginateOverflow() {
    if (isPaginating || !container) return;
    isPaginating = true;
    try {
      let guard = 0;
      while (guard < 90) {
        guard += 1;
        const page = Array.from(container.querySelectorAll('.sheet-page')).find(pageOverflows);
        if (!page) break;
        const changed = pushOverflowFromPage(page);
        if (!changed) { markPageOverflow(page); break; }
      }
    } finally { isPaginating = false; }
  }

  function pageOverflows(page) {
    const body = page.querySelector('.sheet-body');
    return Boolean(body && body.scrollHeight > body.clientHeight + 6);
  }

  function pushOverflowFromPage(page) {
    const block = findLastMovableBlock(page);
    if (!block) return false;
    const parent = block.parentElement;
    const parentColumns = getGridColumnCount(parent);
    const canSplit = Boolean(getSplittableContent(block));
    if (canSplit && parentColumns > 1 && !block.classList.contains('flow-continuation') && !block.nextElementSibling) {
      const continuation = splitBlock(block, { samePage: true });
      if (continuation) { block.after(continuation); hydrateDocument(); return true; }
    }
    if (canSplit) {
      const continuation = splitBlock(block, { samePage: false });
      if (continuation) {
        const target = getContinuationTarget(page, parent);
        target.prepend(continuation);
        hydrateDocument();
        return true;
      }
    }
    const target = getContinuationTarget(page, parent);
    target.prepend(block);
    hydrateDocument();
    return true;
  }

  function findLastMovableBlock(page) {
    const blocks = Array.from(page.querySelectorAll('.sheet-body .block')).filter(block => !block.closest('.mission-cover'));
    return blocks.reverse().find(block => block.offsetParent !== null) || null;
  }

  function getSplittableContent(block) {
    return block.querySelector('.article-body, .briefs-box .editable-block, .qa-box .editable-block, .timeline-box .editable-block, .gm-box .editable-block');
  }

  function splitBlock(block, { samePage }) {
    const content = getSplittableContent(block);
    if (!content) return null;
    const movableNodes = Array.from(content.childNodes).filter(node => node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim()));
    const clone = block.cloneNode(true);
    clone.classList.remove('selected-block', 'dragging', 'drag-over');
    clone.classList.add('flow-continuation');
    clone.querySelectorAll('.block-drag').forEach(el => el.remove());
    const cloneContent = getSplittableContent(clone);
    if (!cloneContent) return null;
    cloneContent.innerHTML = '';
    const title = clone.querySelector('.lead-article h1, .article h2, .block-title');
    if (title && !/continued/i.test(title.textContent)) title.textContent = `${title.textContent.trim()} — continued`;
    if (movableNodes.length > 1) {
      const moveCount = samePage ? Math.max(1, Math.floor(movableNodes.length / 2)) : Math.max(1, Math.ceil(movableNodes.length / 2));
      movableNodes.slice(-moveCount).forEach(node => cloneContent.appendChild(node));
      if (!content.textContent.trim() || !cloneContent.textContent.trim()) return null;
      return clone;
    }
    const text = content.textContent.trim();
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length < 30) return null;
    const splitAt = Math.max(12, Math.floor(words.length * (samePage ? 0.55 : 0.5)));
    content.textContent = words.slice(0, splitAt).join(' ');
    cloneContent.textContent = words.slice(splitAt).join(' ');
    return clone;
  }

  function getContinuationTarget(sourcePage, sourceContainer) {
    const nextPage = getOrCreateNextPage(sourcePage);
    const nextBody = nextPage.querySelector('.sheet-body');
    const layout = Array.from(sourceContainer?.classList || []).find(cls => cls.startsWith('grid-')) || 'grid-1';
    if (!sourceContainer?.matches('.sheet-body')) {
      let section = nextBody.querySelector(`.sheet-grid.${layout}.flow-target`);
      if (!section) {
        section = document.createElement('section');
        section.className = `sheet-grid drop-container flow-target ${layout}`;
        nextBody.prepend(section);
      }
      return section;
    }
    return nextBody;
  }

  function getOrCreateNextPage(page) {
    const next = page.nextElementSibling;
    if (next?.classList?.contains('sheet-page')) return next;
    const wrapper = document.createElement('div');
    const currentTheme = page.dataset.theme || theme || 'nct';
    const currentSize = page.dataset.pageSize || pageSize || 'cyberpunk';
    wrapper.innerHTML = createPageHtml('blank');
    const created = wrapper.firstElementChild;
    created.dataset.theme = currentTheme;
    created.dataset.pageSize = currentSize;
    created.querySelector('.sheet-body').innerHTML = '';
    const img = created.querySelector('.masthead-logo');
    if (img) img.src = mastheadForTheme(currentTheme);
    page.after(created);
    hydrateDocument();
    updatePageNumbers();
    return created;
  }

  function getGridColumnCount(el) {
    const cls = Array.from(el?.classList || []).find(c => c.startsWith('grid-')) || 'grid-1';
    if (cls === 'grid-3' || cls === 'grid-bottom-cards') return 3;
    if (['grid-2', 'grid-sidebar-left', 'grid-sidebar-right', 'grid-feature', 'grid-map'].includes(cls)) return 2;
    return 1;
  }

  function markPageOverflow(page) {
    page.classList.add('flow-warning');
    if (!page.querySelector('.flow-note')) {
      const note = document.createElement('span');
      note.className = 'flow-note control-only';
      note.textContent = 'Overflow could not be fully resolved. Reduce font size, image height, or block count.';
      page.querySelector('.sheet-body')?.appendChild(note);
    }
  }

  async function exportPdf() {
    runLayoutMaintenance({ forcePagination: true });
    const pages = Array.from(container.querySelectorAll('.sheet-page'));
    if (!pages.length) return;
    const title = activePage?.querySelector('.lead-article h1, .mission-cover h1, .article h2')?.textContent || 'screamsheet';
    const filename = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) || 'screamsheet'}.pdf`;
    try {
      status = 'Preparing export...';
      await downloadPagesAsPdf(pages, { pageSize, filename, onProgress: msg => status = msg });
      status = 'PDF download started.';
      setTimeout(() => status = '', 2200);
    } catch (error) {
      status = '';
      alert(`${error.message || 'PDF export failed.'}\n\nUse Print Fallback if this browser is blocking local file rendering.`);
    }
  }
</script>

<header id="editor-ui" class="app-shell" aria-label="Screamsheet editor controls">
  <div class="toolbar-brand"><strong>SCREAMSHEET GENERATOR</strong><span>Svelte editor</span></div>
  <div class="toolbar-group"><label for="theme-select">Theme</label><select id="theme-select" bind:value={theme} on:change={applyTheme}>{#each themes as [value, label]}<option value={value}>{label}</option>{/each}</select></div>
  <div class="toolbar-group"><label for="template-select">Template</label><select id="template-select" bind:value={templateName}>{#each templates as [value, label]}<option value={value}>{label}</option>{/each}</select><button type="button" on:click={addTemplatePage}>Add Page</button></div>
  <div class="toolbar-group"><label for="page-size-select">PDF size</label><select id="page-size-select" bind:value={pageSize} on:change={() => updatePageSize(pageSize)}>{#each Object.entries(PAGE_SIZES) as [value, size]}<option value={value}>{size.label}</option>{/each}</select></div>
  <div class="toolbar-group"><label for="block-select">Block</label><select id="block-select" bind:value={blockType}>{#each blockTypes as [value, label]}<option value={value}>{label}</option>{/each}</select><button type="button" on:click={addSelectedBlock}>Add Block</button></div>
  <div class="toolbar-group layout-toolbar"><label for="layout-select">Selected layout</label><select id="layout-select" bind:value={layoutClass}>{#each layouts as [value, label]}<option value={value}>{label}</option>{/each}</select><div class="mini-button-row"><button type="button" on:click={applySelectedLayout}>Apply Layout</button><button type="button" on:click={addLayoutSection}>Add Section</button></div></div>
  <div class="toolbar-group block-toolbar"><label for="span-select">Selected block</label><select id="span-select" bind:value={spanClass}>{#each spans as [value, label]}<option value={value}>{label}</option>{/each}</select><div class="mini-button-row"><button type="button" on:click={applySelectedSpan}>Apply Span</button><button type="button" on:click={() => moveActiveBlock(-1)}>↑</button><button type="button" on:click={() => moveActiveBlock(1)}>↓</button><button type="button" on:click={duplicateActiveBlock}>Duplicate</button></div></div>
  <div class="toolbar-group image-toolbar"><label for="image-fit-select">Image tools</label><select id="image-fit-select" bind:value={imageFit}><option value="contain">Contain</option><option value="cover">Cover</option><option value="stretch">Stretch</option></select><select bind:value={imagePosition} aria-label="Image position"><option value="image-pos-top">Top image</option><option value="image-pos-left">Left wrap</option><option value="image-pos-right">Right wrap</option><option value="image-pos-hero">Hero/background</option></select><div class="mini-button-row"><button type="button" on:click={addImageSlotToActiveBlock}>Add Image Slot</button><button type="button" on:click={applyImageOptions}>Apply Image</button></div></div>
  <div class="toolbar-group font-toolbar"><label for="body-font-size-input">Font size</label><div class="font-size-row"><span>Body</span><input id="body-font-size-input" type="number" min="8" max="32" step="1" bind:value={bodyFontSize} aria-label="Body font size in pixels" /><span>Title</span><input id="title-font-size-input" type="number" min="12" max="88" step="1" bind:value={titleFontSize} aria-label="Title font size in pixels" /></div><div class="mini-button-row"><button type="button" on:click={applyFontSizeOptions}>Apply Font</button><button type="button" on:click={() => stepSelectedFontSize(-1)}>A−</button><button type="button" on:click={() => stepSelectedFontSize(1)}>A+</button></div></div>
  <div class="toolbar-group flow-toolbar"><label for="auto-flow-toggle">Overflow</label><label class="inline-check"><input id="auto-flow-toggle" type="checkbox" bind:checked={autoFlow} on:change={queueAutosave} /> Auto columns/pages</label><div class="mini-button-row"><button type="button" on:click={() => runLayoutMaintenance({ forcePagination: true })}>Reflow Now</button></div></div>
  <div class="toolbar-actions"><button type="button" on:click={() => modalOpen = true}>Assets</button><button type="button" on:click={saveProject}>Save Project</button><label class="file-button" for="load-project-input">Load Project</label><input id="load-project-input" type="file" accept="application/json,.json" on:change={loadProjectFile} /><button type="button" class="primary" on:click={exportPdf}>Download PDF</button><button type="button" on:click={() => window.print()}>Print Fallback</button></div>
</header>

<main id="document-container" bind:this={container} aria-label="Screamsheet pages" on:click={handleDocumentClick} on:focusin={(event) => { const editable = event.target.closest('[contenteditable=\"true\"]'); if (editable) lastFocusedEditable = editable; }} on:input={queueAutosave} on:paste={handlePlainTextPaste} on:dragstart={handleDragStart} on:dragover={handleDragOver} on:drop={handleDrop} on:dragend={handleDragEnd}>
  {@html documentHtml}
</main>

{#if modalOpen}
<aside id="asset-modal" class="modal open" aria-hidden="false" aria-label="Asset library" on:click={(event) => { if (event.target.id === 'asset-modal') modalOpen = false; }}>
  <div class="modal-card">
    <div class="modal-header"><div><h2>Asset Library</h2><p>Select a target image slot first, then choose an asset.</p></div><button type="button" aria-label="Close asset library" on:click={() => modalOpen = false}>×</button></div>
    <div class="asset-upload-row"><label class="file-button" for="asset-upload-input">Upload Images</label><input bind:this={assetUploadInput} id="asset-upload-input" type="file" accept="image/*" multiple on:change={handleAssetUpload} /><button type="button" on:click={clearUploads}>Clear Uploaded Assets</button></div>
    <div class="asset-library-grid">
      {#each [...Object.entries(ASSET_LIBRARY), ...Object.entries(userAssets)] as [category, assets]}
        {#if Array.isArray(assets) && assets.length}
          <section class="asset-section"><h3>{category}</h3><div class="asset-list">
            {#each assets as asset}
              <button type="button" class="asset-tile" on:click={() => selectAsset(asset.src, asset.name)}><img src={asset.src} alt={asset.name || 'Asset'} loading="lazy" /><span>{asset.name || asset.src.split('/').pop()}</span></button>
            {/each}
          </div></section>
        {/if}
      {/each}
    </div>
  </div>
</aside>
{/if}

{#if status}<div id="export-status" class="active" role="status" aria-live="polite">{status}</div>{/if}
