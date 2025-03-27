import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

type OgImage = {
  imageBuffer: Buffer;
  title: string;
};

export async function generateOgImage({ imageBuffer, title }: OgImage) {
  const imageBase64 = `data:image/png;base64,${imageBuffer.toString("base64")}`;

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: 1200,
          height: 630,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10rem",
          textWrap: "balance",
          color: "black",
          backgroundColor: "rgb(237, 242, 255)",
          backgroundImage:
            "linear-gradient(120deg, #F2F2F3 0%, #F2F2F3 20%, #DDECEE 70%, #DDECEE 100%)",
          fontSize: 72,
          fontWeight: "bold",
          padding: "60px",
          textAlign: "center"
        },
        children: [
          {
            type: "span",
            props: {
              style: {
                maxWidth: "50%"
              },
              children: title
            }
          },
          {
            type: "img",
            props: {
              src: imageBase64,
              width: 360,
              height: 360,
              style: {
                boxShadow: "1px 2px 6px rgba(0,0,0,0.4)",
                borderRadius: "1rem",
                objectFit: "contain"
              }
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
          name: "JetBrainsMono",
          data: await fetch(
            "https://github.com/githubnext/monaspace/raw/refs/heads/main/fonts/webfonts/MonaspaceArgon-Bold.woff"
          ).then((res) => res.arrayBuffer()),
          weight: 400,
          style: "normal"
        }
      ]
    }
  );

  const resvg = new Resvg(svg);
  const pngBuffer = resvg.render().asPng();

  return pngBuffer;
}
