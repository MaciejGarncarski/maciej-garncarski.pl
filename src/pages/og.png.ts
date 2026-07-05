import { generateWebsiteOgImage } from "@/lib/og";
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
   const imageBuffer = await generateWebsiteOgImage();

   return new Response(imageBuffer, {
      headers: {
         "Content-Type": "image/png",
         "Cache-Control": "public, max-age=31536000, immutable",
      },
   });
};
