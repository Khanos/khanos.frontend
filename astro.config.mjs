import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import { fileURLToPath } from 'node:url';
import { parseBackendBase } from './src/config/backend.mjs';
import tailwind from "@astrojs/tailwind";
import robotsTxt from "astro-robots-txt";
import react from "@astrojs/react";
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

import vercel from "@astrojs/vercel";

const development = process.env.NODE_ENV !== 'production';
const env = loadEnv(development ? 'development' : 'production', fileURLToPath(new URL('.', import.meta.url)), 'PUBLIC_');
const backend = parseBackendBase(process.env.PUBLIC_BACKEND_API_URL || env.PUBLIC_BACKEND_API_URL, development);

// https://astro.build/config
export default defineConfig({
  integrations: [
    mdx(),
    tailwind(), 
    robotsTxt(), 
    sitemap({ customSitemaps: ['https://epilef.app/blog-sitemap.xml'] }),
    react(), 
  ],
  site: 'https://epilef.app/',
  // Keep backend assets and authorize only HTTPS public Blob blog paths.
  image: { remotePatterns: [
    { protocol: backend.protocol.slice(0, -1), hostname: backend.hostname, port: backend.port, pathname: '/blog-assets/**' },
    { protocol: 'https', hostname: '*.public.blob.vercel-storage.com', port: '', pathname: '/blog/**' },
  ] },
  // Vercel's runtime loader cannot require sanitize-html's ESM-only parser.
  // Bundle the sanitizer so Vite converts that boundary to native ESM imports.
  vite: { ssr: { noExternal: development ? [] : ['sanitize-html'] } },
  output: 'server',
  adapter: vercel()
});
