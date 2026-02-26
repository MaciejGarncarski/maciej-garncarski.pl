import { readFileSync } from "node:fs";
import path from "node:path";
import { Renderer } from "@takumi-rs/core";
import { fromJsx } from "@takumi-rs/helpers/jsx";
import { faviconUrl, imageSources } from "@/utils/get-og-assets";

type OgImage = {
   imageBuffer: Buffer;
   title: string;
   date: Date;
   tags: string[];
};

const FONT_PATH = path.resolve("src/assets/fonts/Montserrat-Medium.ttf");
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

const intlFormatter = new Intl.DateTimeFormat("pl-PL", {
   month: "long",
   year: "numeric",
});

export async function generateBlogOGImage({ imageBuffer, title, date, tags }: OgImage) {
   const imageBase64 = `data:image/png;base64,${imageBuffer.toString("base64")}`;

   const formattedDate = intlFormatter.format(date);
   const dateResult = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

   const tagsResult = tags.map((tag) => `${tag}`).join("  •  ");

   const { node, stylesheets } = await fromJsx(
      <div
         style={{
            width: 1200,
            height: 630,
            display: "flex",
            flexDirection: "row",
            backgroundColor: "#080d16",
            backgroundImage:
               "linear-gradient(135deg, rgba(3, 6, 11, 1) 0%, rgba(41, 50, 60, 1) 100%)",
            color: "white",
            padding: "45px 45px 60px 45px",
            alignItems: "center",
         }}
      >
         {/* Left Column: Logo and Title */}
         <div
            style={{
               display: "flex",
               flexDirection: "column",
               width: "55%",
               height: "100%",
               textWrap: "pretty",
               justifyContent: "center",
               alignItems: "flex-start",
            }}
         >
            <span
               style={{
                  fontSize: 20,
                  lineHeight: 1.1,
                  borderRadius: "90rem",
                  color: "rgba(255, 255, 255, 0.75)",
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  padding: "12px 14px",
                  textAlign: "left",
               }}
            >
               maciej-garncarski.pl/blog
            </span>
            <span
               style={{
                  fontSize: 56,
                  fontWeight: 400,
                  lineHeight: 1.3,
                  textAlign: "left",
                  marginTop: "40px",
                  marginBottom: "auto",
               }}
            >
               {title}
            </span>
            <img src={faviconUrl} width={60} height={60} alt="" />
         </div>
         {/* Right Column: Main Image and Date */}
         <div
            style={{
               display: "flex",
               flexDirection: "column",
               width: "45%",
               height: "100%",
               justifyContent: "space-between",
               alignItems: "flex-end",
               gap: "20px",
            }}
         >
            <span
               style={{
                  fontSize: 28,
                  opacity: 0.7,
                  marginRight: "10px",
               }}
            >
               {dateResult}
            </span>
            <img
               src={imageBase64}
               width={340}
               height={340}
               alt={title}
               style={{
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.36)",
                  borderRadius: "0.8rem",
                  objectFit: "cover",
               }}
            />
            <span
               style={{
                  fontSize: 24,
                  opacity: 0.7,
                  marginRight: "10px",
               }}
            >
               {tagsResult}
            </span>
         </div>
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
