import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import { transformerNotationDiff, transformerNotationFocus } from "@shikijs/transformers";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
   experimental: {
      clientPrerender: true,
      fonts: [
         {
            provider: fontProviders.google(),
            name: "Lato",
            cssVariable: "--font-ui",
         },
      ],
   },
   prefetch: true,
   site: "https://maciej-garncarski.pl",
   integrations: [sitemap(), mdx(), react()],
   markdown: {
      syntaxHighlight: false,
      rehypePlugins: [
         [
            rehypePrettyCode,
            {
               transformers: [
                  transformerNotationDiff({
                     matchAlgorithm: "v3",
                  }),
                  transformerNotationFocus({
                     matchAlgorithm: "v3",
                  }),
               ],
               keepBackground: true,
               theme: "poimandres",
               onVisitLine(element) {
                  element.children.forEach((el) => {
                     if (el.type === "element") {
                        el.properties["data-code-line"] = "";
                     }
                  });

                  if (element.properties.className?.includes("focused")) {
                     element.properties["data-focused"] = "";
                  }

                  if (element.properties.className?.includes("diff")) {
                     if (element.properties.className.includes("add")) {
                        element.properties["data-diff"] = "add";
                     }

                     if (element.properties.className.includes("remove")) {
                        element.properties["data-diff"] = "remove";
                     }
                  }

                  delete element.properties.className;
               },
               onVisitHighlightedLine(node) {
                  node?.properties?.className?.push("highlighted");
               },
               onVisitHighlightedChars(node) {
                  node?.properties?.className
                     ? node.properties.className.push("highlighted-chars")
                     : (node.properties.className = ["highlighted-chars"]);
               },
            },
         ],
         rehypeHeadingIds,
         [
            rehypeAutolinkHeadings,
            {
               behavior: "wrap",
               content: {
                  type: "element",
                  tagName: "span",
                  properties: {
                     "data-anchor-hash": "",
                  },
                  children: [
                     {
                        type: "element",
                        tagName: "svg",
                        properties: {
                           xmlns: "http://www.w3.org/2000/svg",
                           width: "18",
                           height: "18",
                           viewBox: "0 0 24 24",
                           fill: "none",
                           stroke: "currentColor",
                           strokeWidth: "2",
                           strokeLinecap: "round",
                           strokeLinejoin: "round",
                           className: ["lucide", "lucide-link-icon", "lucide-link"],
                           "aria-hidden": "true",
                        },
                        children: [
                           {
                              type: "element",
                              tagName: "path",
                              properties: {
                                 d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
                              },
                              children: [],
                           },
                           {
                              type: "element",
                              tagName: "path",
                              properties: {
                                 d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
                              },
                              children: [],
                           },
                        ],
                     },
                  ],
               },
               headingProperties: {
                  "data-anchor": "",
               },
               properties: {
                  "data-anchor-link": "",
               },
            },
         ],
      ],
   },
   vite: {
      plugins: [tailwindcss()],
      optimizeDeps: {
         exclude: ["@takumi-rs/core"],
      },
      ssr: {
         external: ["@takumi-rs/core"],
         noExternal: ["@takumi-rs/image-response"],
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
