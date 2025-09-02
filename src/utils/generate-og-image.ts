import { Renderer } from "@takumi-rs/core";
import { container, text } from "@takumi-rs/helpers";

type OgImage = {
  imageBuffer: Buffer;
  title: string;
};

const bgGradient =
  "radial-gradient(circle at 57% 69%, hsla(220, 77%, 32%, 1) 8%, transparent 83%), radial-gradient(circle at 98% 39%, hsla(261, 70%, 22%, 1) 1%, transparent 80%), radial-gradient(circle at 35% 56%, hsla(170, 85%, 27%, 1) 12%, transparent 83%), radial-gradient(circle at 70% 82%, hsla(214, 92%, 27%, 1) 18%, transparent 71%), radial-gradient(circle at 40% 84%, hsla(169, 64%, 44%, 1) 6%, transparent 72%);";

export async function generateOgImage({ imageBuffer, title }: OgImage) {
  const renderer = new Renderer({
    fonts: [Buffer.from(await loadGoogleFont("Montserrat", title))]
  });

  const imageBase64 = `data:image/png;base64,${imageBuffer.toString("base64")}`;

  const node = container({
    style: {
      width: 1200,
      height: 630,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: "2rem",
      color: "white",
      backgroundColor: "hsla(262, 82%, 3%, 1)",
      backgroundImage: bgGradient,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      fontSize: 58,
      fontWeight: "bold",
      padding: "60px",
      textAlign: "center"
    },
    children: [
      {
        type: "image",
        src: imageBase64,
        style: {
          borderRadius: "0.5rem",
          border: "1px solid rgb(255 255 255 / 0.05)",
          objectFit: "contain"
        },
        height: 220,
        width: 220
      },
      {
        type: "text",
        text: title,
        style: {
          backdropFilter: "blur(20px)",
          border: "1px solid rgb(255 255 255 / 0.05)",
          backgroundColor: "rgb(20 20 20 / 0.1)",
          borderRadius: "0.5rem",
          lineHeight: "5rem",
          padding: "1rem 2rem",
          textWrap: "balance",
          width: "75%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center"
        }
      }
    ]
  });

  const png = await renderer.renderAsync(node, {
    width: 1200,
    height: 630,
    format: "png"
  });

  return png;
}

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}
