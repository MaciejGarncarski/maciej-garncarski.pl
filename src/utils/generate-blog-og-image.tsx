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

   const { node, stylesheets } = await fromJsx(
      <div
         tw="flex flex-row relative"
         style={{
            width: 1200,
            height: 630,
            backgroundColor: "#0f1116",
            backgroundImage: "linear-gradient(135deg, #0f1116 0%, #141823 100%)",
            color: "white",
            fontFamily: "Montserrat",
            overflow: "hidden",
         }}
      >
         {/* Top accent gradient line */}
         <div
            tw="absolute"
            style={{
               top: 0,
               left: "15%",
               right: "15%",
               height: 1,
               background:
                  "linear-gradient(to right, transparent, rgba(99, 151, 238, 0.35), transparent)",
            }}
         />

         {/* Bottom accent gradient line */}
         <div
            tw="absolute"
            style={{
               bottom: 0,
               left: "25%",
               right: "25%",
               height: 1,
               background:
                  "linear-gradient(to right, transparent, rgba(99, 151, 238, 0.2), transparent)",
            }}
         />

         {/* Left column: URL badge, title, favicon + date */}
         <div
            tw="flex flex-col relative"
            style={{
               width: 660,
               height: 630,
               padding: "48px 48px 60px 48px",
               justifyContent: "space-between",
               flexShrink: 0,
            }}
         >
            {/* URL badge */}
            <span
               tw="flex"
               style={{
                  alignSelf: "flex-start",
                  fontSize: 18,
                  color: "rgba(142, 169, 192, 1)",
                  border: "1px solid rgba(99, 151, 238, 0.35)",
                  borderRadius: 999,
                  padding: "10px 22px",
                  letterSpacing: "0.05em",
               }}
            >
               maciej-garncarski.pl/blog
            </span>

            {/* Title */}
            <span
               tw="flex"
               style={{
                  fontSize: 56,
                  fontWeight: 700,
                  lineHeight: 1.3,
                  color: "#f5f8fc",
                  flexGrow: 1,
                  alignItems: "center",
                  paddingTop: 34,
                  paddingBottom: 24,
               }}
            >
               {title}
            </span>

            {/* Favicon + date */}
            <div tw="flex flex-row items-center" style={{ gap: 14 }}>
               <img
                  src={faviconUrl}
                  width={50}
                  height={50}
                  alt=""
                  style={{ borderRadius: 7, display: "flex" }}
               />
            </div>
         </div>

         {/* Right column: date, image, tags */}
         <div
            tw="flex flex-col"
            style={{
               flex: 1,
               height: 630,
               padding: "48px 48px 60px 48px",
               alignItems: "flex-end",
            }}
         >
            {/* Date */}
            <span
               tw="flex"
               style={{
                  fontSize: 24,
                  color: "rgba(220, 229, 242, 0.9)",
                  alignSelf: "flex-end",
               }}
            >
               {dateResult}
            </span>

            {/* Blog image */}
            <img
               src={imageBase64}
               alt={title}
               style={{
                  width: 330,
                  height: 330,
                  objectFit: "cover",
                  marginTop: "46px",
                  borderRadius: 16,
                  display: "flex",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
               }}
            />

            {/* Tags as individual pills */}
            <div
               tw="flex flex-row mt-auto"
               style={{ flexWrap: "wrap", gap: 24, justifyContent: "flex-end" }}
            >
               {tags.map((tag) => (
                  <span
                     key={tag}
                     tw="flex"
                     style={{
                        fontSize: 20,
                        color: "rgba(220, 229, 242, 0.9)",
                        background: "rgba(99, 151, 238, 0.15)",
                        border: "1px solid rgba(99, 151, 238, 0.1)",
                        borderRadius: 999,
                        padding: "5px 15px",
                     }}
                  >
                     {tag}
                  </span>
               ))}
            </div>
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
