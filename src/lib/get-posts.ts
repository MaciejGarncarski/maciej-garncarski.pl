import { withReadingTime } from "@/lib/utils";
import { getCollection } from "astro:content";

export async function getPosts() {
   const collection = await getCollection("blog", ({ data }) => data.public && !data.draft);
   return withReadingTime(collection);
}
