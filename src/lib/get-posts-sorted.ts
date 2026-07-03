import { calculateReadingTime } from "@/lib/calculate-read-time";
import { readingTimeMap } from "@/lib/posts-read-time-map";
import { getCollection, type InferEntrySchema } from "astro:content";


export async function getPostsSorted() {
   const collection = await getCollection("blog");

   collection.forEach((entry) => {
      if (!readingTimeMap.has(entry.id)) {
         const readingTime = calculateReadingTime(entry.body || "");
         readingTimeMap.set(entry.id, readingTime);
      }
   });

   const posts = collection.toSorted((a, b) => {
      const getTime = (post: { data: InferEntrySchema<"blog"> }) => {
         if (post.data.updatedDate) {
            return new Date(post.data.updatedDate).getTime();
         }
         if (post.data.publishedDate) {
            return new Date(post.data.publishedDate).getTime();
         }
         return 0;
      };

      return getTime(b) - getTime(a);
   });

   const postsWithReadingTime = posts.flatMap((entry) => {
      if(entry.data.published === false) {
         return [];
      }
      
      const readingTime = readingTimeMap.get(entry.id) || 0;
      return { ...entry, readingTime };
   });

   return postsWithReadingTime;
}
