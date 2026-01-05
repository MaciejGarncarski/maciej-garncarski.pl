import { getCollection, type InferEntrySchema } from "astro:content";

export async function getPostsSorted() {
  const collection = await getCollection("blog");

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

  return posts;
}
