import { fromJsx } from "takumi-js/helpers/jsx";
import { faviconUrl, imageSources } from "@/utils/get-og-assets";
import ImageResponse from "takumi-js/response";
import { readFileSync } from "node:fs";
import path from "node:path";

const FONT_BOLD_PATH = path.resolve("src/assets/fonts/Montserrat-Bold.ttf");
const FONT_MEDIUM_PATH = path.resolve("src/assets/fonts/Montserrat-Medium.ttf");
const fontBoldBuffer = new Uint8Array(readFileSync(FONT_BOLD_PATH));
const fontMediumBuffer = new Uint8Array(readFileSync(FONT_MEDIUM_PATH));

export async function generateDefaultOGImage() {
   const { node, stylesheets } = await fromJsx(
      <div
         tw="flex flex-col relative"
         style={{
            width: 1200,
            height: 630,
            backgroundColor: "#12141c",
            color: "white",
            fontFamily: "Montserrat",
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
            gap: 30,
         }}
      >
         <div
            tw="absolute"
            style={{
               top: 0,
               left: "15%",
               right: "15%",
               height: 1,
               background:
                  "linear-gradient(to right, transparent, rgba(99, 151, 238, 0.5), transparent)",
            }}
         />

         <img
            src={faviconUrl}
            width={160}
            height={160}
            alt=""
            style={{
               borderRadius: 24,
               display: "flex",
               border: "1px solid rgba(99, 151, 238, 0.2)",
               boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4), 0 0 40px rgba(99, 151, 238, 0.1)",
            }}
         />

         <span
            tw="flex"
            style={{
               fontSize: 64,
               fontWeight: 700,
               lineHeight: 1.15,
               color: "#f5f8fc",
               letterSpacing: "-0.02em",
            }}
         >
            Maciej Garncarski
         </span>

         <span
            tw="flex"
            style={{
               fontSize: 24,
               fontWeight: 500,
               color: "#6397ee",
               letterSpacing: "0.18em",
               textTransform: "uppercase",
            }}
         >
            Software Engineer
         </span>

         <div
            tw="absolute"
            style={{
               bottom: 0,
               left: "25%",
               right: "25%",
               height: 1,
               background:
                  "linear-gradient(to right, transparent, rgba(99, 151, 238, 0.3), transparent)",
            }}
         />
      </div>,
   );

   const res = await new ImageResponse(node, {
      fonts: [
         {
            name: "Montserrat",
            data: fontBoldBuffer,
            weight: 700,
            style: "normal",
         },
         {
            name: "Montserrat",
            data: fontMediumBuffer,
            weight: 500,
            style: "normal",
         },
      ],
      width: 1200,
      height: 630,
      format: "png",
      stylesheets,
      fetchedResources: imageSources,
   })

   return res.arrayBuffer()
}
