import { getPosts } from "@/lib/get-posts";

function getPostTimestamp(post: { data: { updatedDate?: Date; publishedDate?: Date } }): number {
   if (post.data.updatedDate) {
      return new Date(post.data.updatedDate).getTime();
   }
   if (post.data.publishedDate) {
      return new Date(post.data.publishedDate).getTime();
   }
   return 0;
}

export async function getPostsSorted() {
   const collection = await getPosts();
   return collection.toSorted((a, b) => getPostTimestamp(b) - getPostTimestamp(a));
}
