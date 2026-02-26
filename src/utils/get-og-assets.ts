import type { ImageSource } from "@takumi-rs/core";

export const faviconUrl = "https://maciej-garncarski.pl/favicon.png";
const [faviconBuffer] = await Promise.all([fetch(faviconUrl).then((res) => res.arrayBuffer())]);

export const imageSources: ImageSource[] = [
   {
      src: faviconUrl,
      data: new Uint8Array(faviconBuffer),
   },
];
