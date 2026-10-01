import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import robotsTxt from "astro-robots-txt";
import react from "@astrojs/react";
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  integrations: [
    mdx(),
    tailwind(), 
    robotsTxt(), 
    sitemap(),
    react(), 
  ],
  site: 'https://epilef.app/',
  output: 'server',
  adapter: vercel()
});
