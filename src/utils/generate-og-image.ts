import { readFileSync } from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

type OgImage = {
   imageBuffer: Buffer;
   title: string;
};

const FONT_PATH = path.resolve("src/assets/fonts/Montserrat-Bold.ttf");
const fontBuffer = readFileSync(FONT_PATH);

export async function generateOgImage({ imageBuffer, title }: OgImage) {
   const imageBase64 = `data:image/png;base64,${imageBuffer.toString("base64")}`;

   const svg = await satori(
      {
         type: "div",
         key: "og",
         props: {
            style: {
               width: 1200,
               height: 630,
               display: "flex",
               flexDirection: "column",
               justifyContent: "center",
               alignItems: "center",
               gap: "2rem",
               textWrap: "balance",
               color: "white",
               backgroundColor: "hsla(262, 82%, 3%, 1)",
               fontSize: 48,
               fontWeight: "bold",
               padding: "60px",
               textAlign: "center",
            },

            children: [
               {
                  type: "img",
                  props: {
                     src: "https://maciej-garncarski.pl/favicon.png",
                     width: 52,
                     height: 52,
                     style: {
                        borderRadius: "0.5rem",
                        objectFit: "contain",
                        position: "absolute",
                        right: "30px",
                        bottom: "30px",
                     },
                  },
               },
               {
                  type: "img",
                  props: {
                     src: imageBase64,
                     width: 300,
                     height: 300,
                     style: {
                        borderRadius: "0.5rem",
                        objectFit: "contain",
                     },
                  },
               },
               {
                  type: "span",
                  props: {
                     style: {
                        lineHeight: "4rem",
                        padding: "1rem 2rem",
                        textWrap: "balance",
                        maxWidth: "75%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                     },
                     children: title,
                  },
               },
            ],
         },
      },
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
