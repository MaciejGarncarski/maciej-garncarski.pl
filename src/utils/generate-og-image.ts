import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

type OgImage = {
  imageBuffer: Buffer;
  title: string;
};

const bgGradient =
  "radial-gradient(circle at 93% 63%, hsla(217, 100%, 30%, 1) 8.392121895570533%, transparent 38.584065253664996%), radial-gradient(circle at 33% -7%, hsla(0, 0%, 0%, 1) 8.392121895570533%, transparent 22.10878124098502%), radial-gradient(circle at 84% 7%, hsla(0, 0%, 0%, 1) 8.392121895570533%, transparent 22.558651527792346%), radial-gradient(circle at 14% 5%, hsla(0, 0%, 0%, 1) 8.392121895570533%, transparent 22.558651527792346%), radial-gradient(circle at 7% 96%, hsla(0, 0%, 0%, 1) 8.392121895570533%, transparent 22.558651527792346%), radial-gradient(circle at 93% 90%, hsla(0, 0%, 0%, 1) 8.392121895570533%, transparent 22.558651527792346%), radial-gradient(circle at 3% 61%, hsla(279, 67%, 27%, 1) 8.392121895570533%, transparent 39.67138181429644%), radial-gradient(circle at 94% 59%, hsla(279, 67%, 27%, 1) 8.392121895570533%, transparent 49.58090142552271%), radial-gradient(circle at 48% 63%, hsla(217, 100%, 39%, 1) 8.392121895570533%, transparent 34.815367581495366%), radial-gradient(circle at 96% 78%, hsla(217, 100%, 30%, 1) 8.392121895570533%, transparent 31.77166380372925%)";

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
          fontSize: 58,
          fontWeight: "bold",
          padding: "60px",
          textAlign: "center"
        },
        children: [
          {
            type: "img",
            props: {
              src: imageBase64,
              width: 220,
              height: 220,
              style: {
                borderRadius: "0.25rem",
                border: "1px solid rgb(255 255 255 / 0.08)",
                objectFit: "contain"
              }
            }
          },
          {
            type: "span",
            props: {
              style: {
                backdropFilter: "blur(20px)",
                border: "1px solid rgb(255 255 255 / 0.08)",
                backgroundColor: "rgb(20 20 20 / 0.2)",
                borderRadius: "0.5rem",
                padding: "0.5rem 2rem",
                textWrap: "balance",
                maxWidth: "60%"
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
