import type { APIRoute } from "astro";
import { getPosts } from "@/utils/get-posts";
import { generateOgBasic } from "@/utils/generate-og-basic";

export const prerender = true;

export const GET: APIRoute = async () => {
  const imageBuffer = await generateOgBasic();

  return new Response(imageBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
};
