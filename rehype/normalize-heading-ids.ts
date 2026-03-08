import type { RehypeNode } from "./types";
import { getNodeProperties } from "./types";

function normalizeAnchorId(value: string): string {
   return value
      .toLowerCase()
      .replace(/ł/g, "l")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w-]/g, "");
}

function getUniqueHeadingId(baseId: string, usedIds: Set<string>): string {
   const normalizedBaseId = baseId || "section";

   if (!usedIds.has(normalizedBaseId)) {
      usedIds.add(normalizedBaseId);
      return normalizedBaseId;
   }

   let suffix = 1;
   let candidateId = `${normalizedBaseId}-${suffix}`;

   while (usedIds.has(candidateId)) {
      suffix += 1;
      candidateId = `${normalizedBaseId}-${suffix}`;
   }

   usedIds.add(candidateId);
   return candidateId;
}

export function rehypeNormalizeHeadingIds() {
   return function transformer(tree: RehypeNode): void {
      const usedIds = new Set<string>();

      const visit = (node: RehypeNode): void => {
         if (node.type === "element") {
            const isHeading = /^h[1-6]$/.test(node.tagName ?? "");
            const properties = getNodeProperties(node);
            const id = properties.id;

            if (isHeading && typeof id === "string") {
               properties.id = getUniqueHeadingId(normalizeAnchorId(id), usedIds);
            }
         }

         if (Array.isArray(node.children)) {
            node.children.forEach(visit);
         }
      };

      visit(tree);
   };
}
