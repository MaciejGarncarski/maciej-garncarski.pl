import { fromJsx } from "@takumi-rs/helpers/jsx";
import { faviconUrl, imageSources } from "@/utils/get-og-assets";
import { renderer } from "@/utils/og-renderer";

type OgImage = {
   imageBuffer: Buffer;
   title: string;
   date: Date;
   tags: string[];
};

const intlFormatter = new Intl.DateTimeFormat("pl-PL", {
   month: "long",
   year: "numeric",
});

const BLOG_IMAGE_URL = "local://blog-image";

const TITLE_CHAR_LIMIT = 64;
const CUTOFF_TITLE_LENGTH = TITLE_CHAR_LIMIT + 10;

export async function generateBlogOGImage({ imageBuffer, title, date, tags }: OgImage) {
   const formattedDate = intlFormatter.format(date);
   const dateResult = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

   const isLongTitle = title.length > TITLE_CHAR_LIMIT;
   const isCutoffLimit = title.length > CUTOFF_TITLE_LENGTH;
   const titleFontSize = isLongTitle ? 50 : 56;
   const adjustedTitle = isCutoffLimit ? `${title.slice(0, CUTOFF_TITLE_LENGTH)}...` : title;

   const { node, stylesheets } = await fromJsx(
      <div
         tw="flex flex-row relative"
         style={{
            width: 1200,
            height: 630,
            backgroundColor: "#12141c",
            color: "white",
            fontFamily: "Montserrat",
            overflow: "hidden",
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
                  "linear-gradient(to right, transparent, rgba(99, 151, 238, 0.35), transparent)",
            }}
         />

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

         <div
            tw="flex flex-col relative"
            style={{
               width: 660,
               height: 630,
               padding: "48px 20px 60px 48px",
               justifyContent: "space-between",
               flexShrink: 0,
            }}
         >
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

            <span
               tw="flex"
               style={{
                  fontSize: titleFontSize,
                  fontWeight: 500,
                  lineHeight: 1.4,
                  color: "#f5f8fc",
                  flexGrow: 1,
                  textWrap: "pretty",
                  alignItems: "center",
                  paddingTop: 34,
                  paddingBottom: 24,
               }}
            >
               {adjustedTitle}
            </span>

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

         <div
            tw="flex flex-col"
            style={{
               flex: 1,
               height: 630,
               padding: "48px 48px 60px 48px",
               alignItems: "flex-end",
            }}
         >
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

            <img
               src={BLOG_IMAGE_URL}
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
      fetchedResources: [
         ...imageSources,
         { src: BLOG_IMAGE_URL, data: new Uint8Array(imageBuffer) },
      ],
   })) as BodyInit;
}
