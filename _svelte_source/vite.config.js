import { defineConfig } from 'vite';
import { svelte } from '@vitejs/plugin-svelte';
export default defineConfig({ base: './', plugins: [svelte()] });
