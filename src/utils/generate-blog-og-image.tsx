import { fromJsx } from "takumi-js/helpers/jsx";
import { faviconUrl, imageSources } from "@/utils/get-og-assets";
import ImageResponse from "takumi-js/response";
import { readFileSync } from "node:fs";
import path from "node:path";

const FONT_BOLD_PATH = path.resolve("src/assets/fonts/Montserrat-Bold.ttf");
const FONT_MEDIUM_PATH = path.resolve("src/assets/fonts/Montserrat-Medium.ttf");
const fontBoldBuffer = new Uint8Array(readFileSync(FONT_BOLD_PATH));
const fontMediumBuffer = new Uint8Array(readFileSync(FONT_MEDIUM_PATH));

type OgImage = {
   title: string;
   date: Date;
   tags: string[];
};

const intlFormatter = new Intl.DateTimeFormat("pl-PL", {
   month: "long",
   year: "numeric",
});

const TITLE_CHAR_LIMIT = 110;

function getTitleFontSize(length: number): number {
  if (length <= 35) return 82; // Massive, punchy text for short titles
  if (length <= 60) return 72; // Larger default size
  if (length <= 85) return 60; // Comfortable mid-range scale
  return 48;                   // Readable fallback for long titles up to 110 chars
}

export async function generateBlogOGImage({ title, date, tags }: OgImage) {
  const formattedDate = intlFormatter.format(date);
  const dateResult = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  const titleFontSize = getTitleFontSize(title.length);
  
  const adjustedTitle =
    title.length > TITLE_CHAR_LIMIT ? `${title.slice(0, TITLE_CHAR_LIMIT)}...` : title;

  const { node, stylesheets } = await fromJsx(
    <div
      tw="flex flex-col relative"
      style={{
        width: 1200,
        height: 630,
        backgroundColor: "#12141c",
        color: "white",
        fontFamily: "Montserrat",
        overflow: "visible",
        padding: "54px 70px 54px 70px",
        justifyContent: "space-between",
      }}
    >
      <div
        tw="absolute"
        style={{
          top: 0,
          left: "15%",
          right: "15%",
          height: 2,
          background: "linear-gradient(to right, transparent, rgba(99, 151, 238, 0.6), transparent)",
        }}
      />

      <div
        tw="absolute"
        style={{
          bottom: 0,
          left: "20%",
          right: "20%",
          height: 2,
          background: "linear-gradient(to right, transparent, rgba(99, 151, 238, 0.6), transparent)",
        }}
      />

      <div tw="flex flex-row" style={{ flexWrap: "wrap", gap: 12 }}>
        {tags.map((tag) => (
          <span
            key={tag}
            tw="flex"
            style={{
              fontSize: 22, 
              color: "rgba(220, 229, 242, 0.9)",
              background: "rgba(99, 151, 238, 0.15)",
              border: "1px solid rgba(99, 151, 238, 0.1)",
              borderRadius: 999,
              padding: "6px 18px",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* MIDDLE: title */}
      <div
        tw="flex flex-1"
        style={{
          paddingTop: 40,
          paddingBottom: 20,
          alignItems: "flex-start",
        }}
      >
        <span
          style={{
            fontSize: titleFontSize,
            fontWeight: 700,
            lineHeight: 1.3,
            color: "#f5f8fc",
            textWrap: "pretty",
          }}
        >
          {adjustedTitle}
        </span>
      </div>

      {/* BOTTOM: avatar + date only */}
      <div tw="flex flex-row items-center" style={{ gap: 32 }}>
        <img
          src={faviconUrl}
          width={60}
          height={60}
          alt=""
          style={{ borderRadius: 8, display: "flex" }}
        />
        <span
          tw="flex"
          style={{
            fontSize: 26, 
            color: "rgba(220, 229, 242, 0.9)",
          }}
        >
          {dateResult}
        </span>
      </div>
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