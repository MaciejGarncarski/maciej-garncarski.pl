import { calculateReadingTime } from "@/lib/calculate-read-time";
import { readingTimeMap } from "@/lib/posts-read-time-map";
import { getCollection, type InferEntrySchema } from "astro:content";

export type Post = InferEntrySchema<"blog">;

export async function getPosts() {
   const collection = await getCollection("blog", ({ data }) => !data.published);

   collection.forEach((entry) => {
      if (!readingTimeMap.has(entry.id)) {
         const readingTime = calculateReadingTime(entry.body || "");
         readingTimeMap.set(entry.id, readingTime);
      }
   });

   return collection.map((entry) => ({
      ...entry,
      readingTime: readingTimeMap.get(entry.id) || 0,
   }));
}
