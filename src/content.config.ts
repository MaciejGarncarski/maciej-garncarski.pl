import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
   loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
   schema: ({ image }) =>
      z.object({
         title: z.string(),
         tags: z.array(z.string()),
         description: z.string(),
         pubDate: z.coerce.date(),
         updatedDate: z.coerce.date().optional(),
         heroImage: image(),
      }),
});

export const collections = { blog };
