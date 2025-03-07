import { defineConfig, envField } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import {
  transformerNotationDiff,
  transformerNotationFocus
} from "@shikijs/transformers";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  env: {
    schema: {
      REDIS_URL: envField.string({ context: "server", access: "secret" }),
      REDIS_PASS: envField.string({ context: "server", access: "secret" })
    }
  },

  site: "https://maciej-garncarski.pl",

  integrations: [sitemap(), mdx()],

  experimental: {
    responsiveImages: true
  },

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
          keepBackground: false,
          theme: {
            light: "github-light",
            dark: "nord"
          },
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
            children: [{ type: "text", value: "#" }]
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
    ssr: {
      external: ["node:fs", "node:path"]
    }
  },
  output: "server",
  adapter: cloudflare({
    cloudflareModules: true,
    imageService: "compile",
    platformProxy: {
      enabled: true,
      configPath: "wrangler.toml"
    }
  })
});
