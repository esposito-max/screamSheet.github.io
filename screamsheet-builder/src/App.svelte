<script>
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from './assets/vite.svg'
  import heroImg from './assets/hero.png'
  import Counter from './lib/Counter.svelte'
</script>

<section id="center">
  <div class="hero">
    <img src={heroImg} class="base" width="170" height="179" alt="" />
    <img src={svelteLogo} class="framework" alt="Svelte logo" />
    <img src={viteLogo} class="vite" alt="Vite logo" />
  </div>
  <div>
    <h1>Get started</h1>
    <p>Edit <code>src/App.svelte</code> and save to test <code>HMR</code></p>
  </div>
  <Counter />
</section>

<div class="ticks"></div>

<section id="next-steps">
  <div id="docs">
    <svg class="icon" role="presentation" aria-hidden="true">
      <use href="/icons.svg#documentation-icon"></use>
    </svg>
    <h2>Documentation</h2>
    <p>Your questions, answered</p>
    <ul>
      <li>
        <a href="https://vite.dev/" target="_blank" rel="noreferrer">
          <img class="logo" src={viteLogo} alt="" />
          Explore Vite
        </a>
      </li>
      <li>
        <a href="https://svelte.dev/" target="_blank" rel="noreferrer">
          <img class="button-icon" src={svelteLogo} alt="" />
          Learn more
        </a>
      </li>
    </ul>
  </div>
  <div id="social">
    <svg class="icon" role="presentation" aria-hidden="true">
      <use href="/icons.svg#social-icon"></use>
    </svg>
    <h2>Connect with us</h2>
    <p>Join the Vite community</p>
    <ul>
      <li>
        <a href="https://github.com/vitejs/vite" target="_blank" rel="noreferrer">
          <svg class="button-icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#github-icon"></use>
          </svg>
          GitHub
        </a>
      </li>
      <li>
        <a href="https://chat.vite.dev/" target="_blank" rel="noreferrer">
          <svg class="button-icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#discord-icon"></use>
          </svg>
          Discord
        </a>
      </li>
      <li>
        <a href="https://x.com/vite_js" target="_blank" rel="noreferrer">
          <svg class="button-icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#x-icon"></use>
          </svg>
          X.com
        </a>
      </li>
      <li>
        <a href="https://bsky.app/profile/vite.dev" target="_blank" rel="noreferrer">
          <svg class="button-icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#bluesky-icon"></use>
          </svg>
          Bluesky
        </a>
      </li>
    </ul>
  </div>
</section>

<div class="ticks"></div>
<section id="spacer"></section>
<script>
  // State: The data model driving the UI
  let activeTheme = 'nct';
  let pages = [
    { id: crypto.randomUUID(), layoutBlocks: ['1-col'] }
  ];
  let activePageId = pages[0].id;

  const themes = {
    'nct': { primary: '#c56aad', bg: '#ffffff', text: '#000000' },
    'militech': { primary: '#4D5D53', bg: '#ffffff', text: '#000000' }
  };

  // Actions
  function addPage() {
    const newPage = { id: crypto.randomUUID(), layoutBlocks: ['1-col'] };
    pages = [...pages, newPage];
    activePageId = newPage.id;
  }

  function removePage(id) {
    if (pages.length === 1) return alert("Cannot delete the last page.");
    pages = pages.filter(p => p.id !== id);
    if (activePageId === id) activePageId = pages[0].id;
  }

  function addBlock(pageId, blockType) {
    pages = pages.map(page => 
      page.id === pageId 
        ? { ...page, layoutBlocks: [...page.layoutBlocks, blockType] } 
        : page
    );
  }
</script>

<style>
  /* Scoped CSS - only applies to this component */
  .toolbar { background: #27272a; padding: 1rem; color: white; display: flex; gap: 1rem; }
  .page { 
    max-width: 210mm; min-height: 297mm; margin: 2rem auto; 
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
    position: relative;
  }
  .active-page { outline: 4px solid #ef4444; }
  .remove-btn { position: absolute; top: -1rem; right: -1rem; background: red; color: white; border-radius: 50%; padding: 0.5rem; cursor: pointer; }
</style>

<div class="toolbar">
  <span class="font-bold text-red-500">SCREAMSHEET EDITOR</span>
  
  <select bind:value={activeTheme} class="bg-zinc-700 text-white p-2">
    <option value="nct">NCT News</option>
    <option value="militech">Militech (Camo)</option>
  </select>

  <button on:click={addPage} class="bg-green-600 p-2 text-white">+ Add Page</button>
  <button on:click={() => addBlock(activePageId, '2-col')} class="bg-gray-600 p-2 text-white">+ Add 2-Col Block</button>
</div>

<div class="workspace bg-zinc-900 min-h-screen p-8">
  {#each pages as page (page.id)}
    <div 
      class="page" 
      class:active-page={activePageId === page.id}
      on:click={() => activePageId = page.id}
      style="
        --theme-primary: {themes[activeTheme].primary};
        background-color: {themes[activeTheme].bg};
        color: {themes[activeTheme].text};
      "
    >
      <button class="remove-btn" on:click|stopPropagation={() => removePage(page.id)}>X</button>
      
      <header style="border-bottom: 2px solid black; padding: 2rem; display: flex; justify-content: space-between;">
        <h1 style="color: var(--theme-primary); font-size: 2rem; font-weight: 900;">NEWS HEADER</h1>
      </header>

      <main style="padding: 2rem;">
        {#each page.layoutBlocks as block}
          <div style="border: 1px dashed #ccc; padding: 1rem; margin-bottom: 1rem;">
            Rendering {block} Layout Template
            </div>
        {/each}
      </main>
    </div>
  {/each}
</div>