import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
   loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
   schema: ({ image }) =>
      z.object({
         title: z.string(),
         keywords: z.array(z.string()),
         tags: z.array(z.string()),
         description: z.string(),
         canonicalUrl: z.string().optional(),
         pubDate: z.coerce.date(),
         updatedDate: z.coerce.date().optional(),
         heroImage: image(),
      }),
});

export const collections = { blog };
