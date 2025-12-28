import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import {
  transformerNotationDiff,
  transformerNotationFocus
} from "@shikijs/transformers";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";

import vercel from "@astrojs/vercel";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  experimental: {
    clientPrerender: true,
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Lato",
        cssVariable: "--font-ui"
      }
    ]
  },
  prefetch: true,
  site: "https://maciej-garncarski.pl",
  integrations: [sitemap(), mdx()],
  markdown: {
    syntaxHighlight: false,
    rehypePlugins: [
      [
        rehypePrettyCode,
        {
          transformers: [
            transformerNotationDiff({
              matchAlgorithm: "v3"
            }),
            transformerNotationFocus({
              matchAlgorithm: "v3"
            })
          ],
          keepBackground: true,
          theme: "nord",
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
          }
        }
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
              ["data-anchor-hash"]: ""
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
                  "aria-hidden": "true"
                },
                children: [
                  {
                    type: "element",
                    tagName: "path",
                    properties: {
                      d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                    },
                    children: []
                  },
                  {
                    type: "element",
                    tagName: "path",
                    properties: {
                      d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                    },
                    children: []
                  }
                ]
              }
            ]
          },
          headingProperties: {
            ["data-anchor"]: ""
          },
          properties: {
            ["data-anchor-link"]: ""
          }
        }
      ]
    ]
  },
  vite: {
    plugins: [tailwindcss()]
  },
  output: "static",
  adapter: vercel({ imageService: true, devImageService: "sharp" })
});
