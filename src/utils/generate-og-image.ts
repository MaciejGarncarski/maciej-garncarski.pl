import { readFileSync } from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

type OgImage = {
   imageBuffer: Buffer;
   title: string;
   date: Date;
   tags: string[];
};

const FONT_PATH = path.resolve("src/assets/fonts/Montserrat-Medium.ttf");
const fontBuffer = readFileSync(FONT_PATH);

const intlFormatter = new Intl.DateTimeFormat("pl-PL", {
   month: "long",
   year: "numeric",
});

export async function generateOgImage({ imageBuffer, title, date, tags }: OgImage) {
   const imageBase64 = `data:image/png;base64,${imageBuffer.toString("base64")}`;

   const formattedDate = intlFormatter.format(date);
   const dateResult = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

   const tagsResult = tags.map((tag) => `${tag}`).join(" • ");

   const svg = await satori(
      {
         type: "div",
         props: {
            style: {
               width: 1200,
               height: 630,
               display: "flex",
               flexDirection: "row", // Horizontal Split
               backgroundColor: "#080d16",
               backgroundImage:
                  "linear-gradient(135deg, rgba(3, 6, 11, 1) 0%, rgba(41, 50, 60, 1) 100%)",
               color: "white",
               padding: "45px 45px 60px 45px",
               alignItems: "center",
            },
            children: [
               // Left Column: Logo and Title
               {
                  type: "div",
                  props: {
                     style: {
                        display: "flex",
                        flexDirection: "column",
                        width: "55%",
                        height: "100%",
                        textWrap: "pretty",
                        justifyContent: "center",
                        alignItems: "flex-start",
                     },
                     children: [
                        {
                           type: "span",
                           props: {
                              style: {
                                 fontSize: 20,
                                 lineHeight: 1.1,
                                 borderRadius: "90rem",
                                 color: "rgba(255, 255, 255, 0.75)",
                                 border: "1px solid rgba(255, 255, 255, 0.4)",
                                 padding: "12px 14px",
                                 textAlign: "left",
                              },
                              children: "maciej-garncarski.pl/blog",
                           },
                        },
                        {
                           type: "span",
                           props: {
                              style: {
                                 fontSize: 56,
                                 fontWeight: 400,
                                 lineHeight: 1.3,
                                 textAlign: "left",
                                 marginTop: "40px",
                                 marginBottom: "auto",
                              },
                              children: title,
                           },
                        },
                        {
                           type: "img",
                           props: {
                              src: "https://maciej-garncarski.pl/favicon.png",
                              width: 60,
                              height: 60,
                           },
                        },
                     ],
                  },
               },
               // Right Column: Main Image and Date
               {
                  type: "div",
                  props: {
                     style: {
                        display: "flex",
                        flexDirection: "column",
                        width: "45%",
                        height: "100%",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        gap: "20px",
                     },
                     children: [
                        {
                           type: "span",
                           props: {
                              style: {
                                 fontSize: 28,
                                 opacity: 0.7,
                                 marginRight: "10px",
                              },
                              children: dateResult,
                           },
                        },
                        {
                           type: "img",
                           props: {
                              src: imageBase64,
                              width: 340,
                              height: 340,
                              style: {
                                 boxShadow: "0 20px 60px rgba(0, 0, 0, 0.36)",
                                 borderRadius: "0.8rem",
                                 objectFit: "cover",
                              },
                           },
                        },
                        {
                           type: "span",
                           props: {
                              style: {
                                 fontSize: 24,
                                 opacity: 0.7,
                                 marginRight: "10px",
                              },
                              children: tagsResult,
                           },
                        },
                     ],
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
   return resvg.render().asPng() as BodyInit;
}
