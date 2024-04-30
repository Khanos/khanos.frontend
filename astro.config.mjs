import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import robotsTxt from "astro-robots-txt";
import react from "@astrojs/react";
import robotsTxt from 'astro-robots-txt';
import sitemap from '@astrojs/sitemap';

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(), 
    robotsTxt(), 
    react(),
    (await import("@playform/compress")).default(),
    robotsTxt(),
    sitemap(),
  ],
  site: 'https://epilef.app/',
  output: 'server',
  adapter: vercel()
});