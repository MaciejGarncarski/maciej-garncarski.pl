import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

import { markdownRehypePlugins } from "./rehype/plugins";

// https://astro.build/config
export default defineConfig({
   fonts: [
      {
         provider: fontProviders.google(),
         name: "Lato",
         cssVariable: "--font-ui",
      },
   ],
   experimental: {
      clientPrerender: true,
   },
   prefetch: true,
   site: "https://maciej-garncarski.pl",
   integrations: [sitemap(), mdx(), react()],
   markdown: {
      syntaxHighlight: false,
      rehypePlugins: markdownRehypePlugins,
   },
   vite: {
      plugins: [tailwindcss()],
      optimizeDeps: {
         exclude: ["@takumi-rs/core"],
      },
      ssr: {
         external: ["@takumi-rs/core"],
      },
   },
   output: "static",
   image: {
      service: {
         entrypoint: "astro/assets/services/sharp",
      },
   },
   adapter: vercel({ imageService: false, devImageService: "sharp" }),
});
