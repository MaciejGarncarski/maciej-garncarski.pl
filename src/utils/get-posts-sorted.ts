import { calculateReadingTime } from "@/utils/calculate-read-time";
import { readingTimeMap } from "@/utils/posts-read-time-map";
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
         if (post.data.pubDate) {
            return new Date(post.data.pubDate).getTime();
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
