import type { ShikiTransformer } from "@shikijs/types";

const META_REGEX = /\{([^}]+)\}|([\w-]+)(?:="([^"]+)")?/g;

function parseMetaAttributes(meta: string): Record<string, string> {
   const attrs: Record<string, string> = {};

   for (const match of meta.matchAll(META_REGEX)) {
      const [, bracketAttr, key, value] = match;

      if (bracketAttr) {
         attrs[bracketAttr] = "";
         continue;
      }

      if (key) {
         attrs[key] = value ?? "";
      }
   }

   return attrs;
}

export const customAttributesTransformer: ShikiTransformer = {
   name: "custom-attributes",

   pre(node) {
      const rawMeta = this.options?.meta?.__raw;
      if (!rawMeta) return node;

      const attributes = parseMetaAttributes(rawMeta);

      node.properties ??= {};

      Object.assign(node.properties, attributes);

      return node;
   },
};
