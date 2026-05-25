import type { APIContext, APIRoute } from "astro";
import { getPosts } from "@/utils/get-posts";
import { generateBlogOGImage } from "@/utils/generate-blog-og-image";

export const GET: APIRoute = async ({ props }: APIContext) => {
   const { post } = props as Props;

   const imageBuffer = await generateBlogOGImage({
      title: post.data.title,
      tags: post.data.tags,
      date: new Date(post.data.updatedDate || post.data.pubDate),
   });

   return new Response(imageBuffer, {
      headers: {
         "Content-Type": "image/png",
         "Cache-Control": "public, max-age=31536000, immutable",
      },
   });
};

export async function getStaticPaths() {
   const blogPosts = await getPosts();

   return blogPosts.map((post) => {
      return {
         params: { slug: post.id },
         props: { post },
      };
   });
}

type Props = {
   post: Awaited<ReturnType<typeof getPosts>>[number];
};
