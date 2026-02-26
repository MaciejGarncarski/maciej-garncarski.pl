import { readFileSync } from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

const FONT_PATH = path.resolve("src/assets/fonts/Montserrat-Bold.ttf");
const fontBuffer = readFileSync(FONT_PATH);

export async function generateBasicOGImage() {
   const svg = await satori(
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
            src="https://maciej-garncarski.pl/favicon.png"
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
      {
         width: 1200,
         height: 630,
         fonts: [
            {
               name: "Montserrat",
               data: fontBuffer,
               weight: 700,
               style: "normal",
            },
         ],
      },
   );

   const resvg = new Resvg(svg);
   const pngBuffer = resvg.render().asPng();

   return pngBuffer as BodyInit;
}
