import type { APIRoute } from "astro";
import { generateOgImage } from "@utils/generate-og-image";
import { readFileSync } from "node:fs";
import { getPosts } from "@/utils/get-posts";

export const prerender = true;

export const GET: APIRoute = async ({ params }) => {
  const posts = await getPosts();
  const post = posts.find((p) => p.id === params.slug);

  if (!post) {
    return new Response("Not Found", { status: 404 });
  }

  const postCover = readFileSync(`src/assets/blog/${post.id}/hero.png`);

  const imageBuffer = await generateOgImage({
    imageBuffer: postCover,
    title: post.data.title
  });

  // @ts-ignore
  return new Response(imageBuffer, {
    headers: {
      "Content-Type": "image/png"
    }
  });
};

export async function getStaticPaths() {
  const blogPosts = await getPosts();
  return blogPosts.map((post) => ({
    params: { slug: post.id },
    props: { post }
  }));
}
