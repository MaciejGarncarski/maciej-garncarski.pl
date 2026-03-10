import { rehypeHeadingIds, type RehypePlugins } from "@astrojs/markdown-remark";

import { autolinkHeadingsPlugin } from "./autolink-headings";
import { rehypeNormalizeHeadingIds } from "./normalize-heading-ids";
import { prettyCodePlugin } from "./pretty-code";

export const markdownRehypePlugins: RehypePlugins = [
   prettyCodePlugin,
   rehypeHeadingIds,
   rehypeNormalizeHeadingIds,
   autolinkHeadingsPlugin,
];
