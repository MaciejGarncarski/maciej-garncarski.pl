export type RehypeProperties = Record<string, unknown> & {
   className?: string[];
   id?: string;
};

export type RehypeNode = {
   children?: RehypeNode[];
   properties?: RehypeProperties;
   tagName?: string;
   type?: string;
};

export function getNodeProperties(node: RehypeNode): RehypeProperties {
   if (!node.properties) {
      node.properties = {};
   }

   return node.properties;
}
