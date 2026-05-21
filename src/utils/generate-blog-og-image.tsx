import { fromJsx } from "takumi-js/helpers/jsx";
import { faviconUrl, imageSources } from "@/utils/get-og-assets";
import { renderer } from "@/utils/og-renderer";

type OgImage = {
   title: string;
   date: Date;
   tags: string[];
};

const intlFormatter = new Intl.DateTimeFormat("pl-PL", {
   month: "long",
   year: "numeric",
});

const TITLE_CHAR_LIMIT = 74;

function getTitleFontSize(length: number): number {
  if (length <= 40) return 70;
  if (length <= 55) return 62;
  if (length <= 70) return 54;
  return 42;
}

export async function generateBlogOGImage({ title, date, tags }: OgImage) {
  const formattedDate = intlFormatter.format(date);
  const dateResult = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  const titleFontSize = getTitleFontSize(title.length);
  const lineHeight = title.length > 55 ? 1.5 : 1.6;
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
        overflow: "hidden",
        padding: "48px 60px 50px 60px",
        justifyContent: "space-between",
      }}
    >
      <div
        tw="absolute"
        style={{
          top: 0,
          left: "15%",
          right: "15%",
          height: 1,
          background: "linear-gradient(to right, transparent, rgba(99, 151, 238, 0.6), transparent)",
        }}
      />
      <div
        tw="absolute"
        style={{
          bottom: 0,
          left: "25%",
          right: "25%",
          height: 1,
          background: "linear-gradient(to right, transparent, rgba(99, 151, 238, 0.6), transparent)",
        }}
      />

      {/* TOP: tags (previously URL badge position) */}
      <div tw="flex flex-row" style={{ flexWrap: "wrap", gap: 12 }}>
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

      {/* MIDDLE: title */}
      <span
        tw="flex"
        style={{
          fontSize: titleFontSize,
          fontWeight: 700,
          lineHeight: lineHeight,
          color: "#f5f8fc",
          flexGrow: 1,
          textWrap: "pretty",
          paddingTop: 34,
          paddingBottom: 24,
        }}
      >
        {adjustedTitle}
      </span>

      {/* BOTTOM: avatar + date only */}
      <div tw="flex flex-row items-center" style={{ gap: 32 }}>
        <img
          src={faviconUrl}
          width={50}
          height={50}
          alt=""
          style={{ borderRadius: 7, display: "flex" }}
        />
        <span
          tw="flex"
          style={{
            fontSize: 24,
            color: "rgba(220, 229, 242, 0.9)",
          }}
        >
          {dateResult}
        </span>
      </div>
    </div>,
  );

  return (await renderer.render(node, {
    width: 1200,
    height: 630,
    format: "png",
    stylesheets,
    fetchedResources: [...imageSources],
  })) as BodyInit;
}