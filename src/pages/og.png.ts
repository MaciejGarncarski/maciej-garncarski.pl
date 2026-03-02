import { generateDefaultOGImage } from "@/utils/generate-default-og-image";
import type { APIRoute } from "astro";

export const prerender = true;

export const GET: APIRoute = async () => {
   const imageBuffer = await generateDefaultOGImage();

   return new Response(imageBuffer, {
      headers: {
         "Content-Type": "image/png",
         "Cache-Control": "public, max-age=31536000, immutable",
      },
   });
};
