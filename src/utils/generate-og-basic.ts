import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

export async function generateOgBasic() {
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
          fontSize: 64,
          fontWeight: "bold",
          padding: "60px",
          textAlign: "center"
        },
        children: [
          {
            type: "img",
            props: {
              src: "https://maciej-garncarski.pl/favicon.png",
              width: 200,
              height: 200,
              style: {
                borderRadius: "0.5rem",
                objectFit: "contain"
              }
            }
          },
          {
            type: "span",
            props: {
              style: {
                lineHeight: "4rem",
                padding: "1rem 2rem",
                textWrap: "balance",
                maxWidth: "75%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center"
              },
              children: "Maciej Garncarski"
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
          data: await loadGoogleFont("Montserrat", "Maciej Garncarski"),
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
