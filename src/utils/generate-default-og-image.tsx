import { fromJsx } from "@takumi-rs/helpers/jsx";
import { faviconUrl, imageSources } from "@/utils/get-og-assets";
import { renderer } from "@/utils/og-renderer";

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

   return (await renderer.render(node, {
      width: 1200,
      height: 630,
      format: "png",
      stylesheets,
      fetchedResources: imageSources,
   })) as BodyInit;
}
