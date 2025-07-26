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
            children: [{ type: "text", value: "#" }],
            type: "element",
            tagName: "span",
            properties: {
              ["data-anchor-hash"]: ""
            }
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
  adapter: vercel()
});
