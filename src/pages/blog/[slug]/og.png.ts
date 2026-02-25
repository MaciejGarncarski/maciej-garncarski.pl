import { readFileSync } from "node:fs";
import path from "node:path";
import { generateOgImage } from "@utils/generate-og-image";
import type { APIContext, APIRoute } from "astro";
import { getPosts } from "@/utils/get-posts";

export const prerender = true;

export const GET: APIRoute = async ({ props, redirect }: APIContext) => {
   const { post, postCover } = props as Props;

   if (!postCover) {
      return redirect("/og.png");
   }

   const imageBuffer = await generateOgImage({
      imageBuffer: postCover,
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
      const imagePath = path.resolve(`src/assets/blog/${post.id}/hero.png`);
      let postCover: Buffer | null = null;

      try {
         postCover = readFileSync(imagePath);
      } catch (error) {
         console.log(error);
         postCover = null;
      }

      return {
         params: { slug: post.id },
         props: { post, postCover },
      };
   });
}

type Props = {
   post: Awaited<ReturnType<typeof getPosts>>[number];
   postCover: Buffer | null;
};
