import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

type OgImage = {
  imageBuffer: Buffer;
  title: string;
};

const bgGradient = `
  radial-gradient(circle at 57% 69%, hsla(220, 77%, 25%, 1) 8%, transparent 83%),
  radial-gradient(circle at 98% 39%, hsla(261, 70%, 22%, 1) 1%, transparent 80%),
  radial-gradient(circle at 35% 56%, hsla(170, 85%, 22%, 1) 12%, transparent 83%),
  radial-gradient(circle at 70% 82%, hsla(214, 92%, 22%, 1) 18%, transparent 71%),
  radial-gradient(circle at 40% 84%, hsla(169, 64%, 30%, 1) 6%, transparent 72%)
`;

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
          backgroundImage: bgGradient,
          fontSize: 48,
          fontWeight: "bold",
          padding: "60px",
          textAlign: "center"
        },
        children: [
          {
            type: "img",
            props: {
              src: imageBase64,
              width: 300,
              height: 300,
              style: {
                borderRadius: "0.5rem",
                border: "1px solid rgb(255 255 255 / 0.05)",
                objectFit: "contain"
              }
            }
          },
          {
            type: "span",
            props: {
              style: {
                backdropFilter: "blur(20px)",
                border: "1px solid rgb(255 255 255 / 0.05)",
                backgroundColor: "rgb(20 20 20 / 0.1)",
                borderRadius: "0.5rem",
                lineHeight: "3.5rem",
                padding: "1rem 2rem",
                textWrap: "balance",
                maxWidth: "75%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center"
              },
              children: title
            }
          }
        ]
      }
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Geist",
          weight: 900,
          data: await loadGoogleFont("Montserrat", title),
          style: "normal"
        }
      ]
    }
  );

  const resvg = new Resvg(svg);
  const pngBuffer = resvg.render().asPng();

  return pngBuffer;
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
