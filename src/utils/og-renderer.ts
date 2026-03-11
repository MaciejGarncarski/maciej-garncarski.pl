import { Renderer } from "@takumi-rs/core";
import { readFileSync } from "node:fs";
import path from "node:path";

const FONT_BOLD_PATH = path.resolve("src/assets/fonts/Montserrat-Bold.ttf");
const FONT_MEDIUM_PATH = path.resolve("src/assets/fonts/Montserrat-Medium.ttf");
const fontBoldBuffer = new Uint8Array(readFileSync(FONT_BOLD_PATH));
const fontMediumBuffer = new Uint8Array(readFileSync(FONT_MEDIUM_PATH));

export const renderer = new Renderer({
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
});
