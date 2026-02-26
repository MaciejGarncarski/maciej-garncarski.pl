import { readFileSync } from "node:fs";
import path from "node:path";
import { Renderer } from "@takumi-rs/core";
import { fromJsx } from "@takumi-rs/helpers/jsx";
import { faviconUrl, imageSources } from "@/utils/get-og-assets";

const FONT_PATH = path.resolve("src/assets/fonts/Montserrat-Bold.ttf");
const fontBuffer = new Uint8Array(readFileSync(FONT_PATH));

const renderer = new Renderer({
   fonts: [
      {
         name: "Montserrat",
         data: fontBuffer,
         weight: 700,
         style: "normal",
      },
   ],
});

export async function generateBasicOGImage() {
   const { node, stylesheets } = await fromJsx(
      <div
         key="og"
         style={{
            width: 1200,
            height: 630,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "2rem",
            textWrap: "balance",
            color: "white",
            backgroundColor: "#080d16",
            backgroundImage:
               "linear-gradient(135deg, rgba(3, 6, 11, 1) 0%, rgba(41, 50, 60, 1) 100%)",
            fontSize: 64,
            fontWeight: "bold",
            padding: "60px",
            textAlign: "center",
         }}
      >
         <img
            src={faviconUrl}
            width={200}
            alt=""
            height={200}
            style={{
               borderRadius: "0.5rem",
               objectFit: "contain",
            }}
         />
         <span
            style={{
               lineHeight: "4rem",
               padding: "1rem 2rem",
               textWrap: "balance",
               maxWidth: "75%",
               display: "flex",
               justifyContent: "center",
               alignItems: "center",
               textAlign: "center",
            }}
         >
            Maciej Garncarski
         </span>
      </div>,
   );

   return (await renderer.render(node, {
      width: 1200,
      height: 630,
      format: "png",
      stylesheets,
      fetchedResources: imageSources,
   })) as BodyInit;
}
