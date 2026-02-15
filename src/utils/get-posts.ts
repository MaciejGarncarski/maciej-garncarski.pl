import { getCollection, type InferEntrySchema } from "astro:content";

export async function getPosts() {
   const collection = await getCollection("blog");
   return collection;
}
