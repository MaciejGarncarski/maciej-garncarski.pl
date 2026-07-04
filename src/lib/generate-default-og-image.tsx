import { fromJsx } from "takumi-js/helpers/jsx";
import { imageSources } from "@/lib/get-og-assets";
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

         <svg
            width="150"
            height="150"
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
         >
            <path
               id="favicon-svg-path"
               d="M172.933 251L249.387 99.001H322.914L223.427 297.325L191.591 357.489H152.908L94.6572 248.27V412.1H0V99.001H94.6572L172.933 251ZM412.791 99C449.198 99.0001 478.172 105.962 499.713 119.887L486.06 188.205C466.946 180.373 447.074 176.456 426.444 176.456C401.567 176.456 381.998 183.564 367.738 197.778C353.479 211.993 346.349 231.72 346.349 256.958C346.349 282.487 352.721 302.358 365.463 316.573C378.508 330.788 395.043 337.895 415.066 337.896C422.348 337.895 428.416 337.316 433.271 336.155V261.745L512 253.042V389.243C494.707 396.786 477.11 402.443 459.21 406.214C441.31 409.985 423.865 411.87 406.875 411.87C374.109 411.87 345.59 405.488 321.319 392.724C297.352 379.959 278.693 362.263 265.344 339.636C264.927 338.929 264.516 338.219 264.112 337.506L382.9 101.013C392.469 99.6713 402.433 99 412.791 99Z"
               fill="#ffffff"
            />
         </svg>

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
   });

   return res.arrayBuffer();
}
