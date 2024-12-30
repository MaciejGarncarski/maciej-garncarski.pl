import type { APIRoute } from "astro";
import { generateOgImage } from "../../../utils/generate-og-image";
import { getCollection } from "astro:content";
import { readFileSync } from "node:fs";

export const prerender = true;

export const GET: APIRoute = async ({ params }) => {
  const posts = await getCollection("blog");
  const post = posts.find((p) => p.id === params.slug);

  if (!post) {
    return new Response("Not Found", { status: 404 });
  }

  const postCover = readFileSync(`src/assets/blog/${post.id}/hero.png`);

  const imageBuffer = await generateOgImage({
    imageBuffer: postCover,
    title: post.data.title
  });

  return new Response(imageBuffer, {
    headers: {
      "Content-Type": "image/png"
    }
  });
};

export async function getStaticPaths() {
  const blogPosts = await getCollection("blog");
  return blogPosts.map((post) => ({
    params: { slug: post.id },
    props: { post }
  }));
}
