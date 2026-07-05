export function calculateReadingTime(mdxContent: string, wordsPerMinute: number = 210) {
   const text = mdxContent.replace(/<\/?[^>]+(>|$)/g, "");
   const wordCount = text.split(/\s+/).filter(Boolean).length;
   return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export function withReadingTime<T extends { id: string; body?: string }>(
   entries: T[],
): (T & { readingTime: number })[] {
   return entries.map((entry) => ({
      ...entry,
      readingTime: calculateReadingTime(entry.body ?? ""),
   }));
}

export function normalizeTag(tag: string): string {
   return tag
      .toLowerCase()
      .replace(/ł/g, "l")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
}

export const dateFormatter = new Intl.DateTimeFormat("pl-PL", {
   year: "numeric",
   month: "long",
   day: "numeric",
});

export function formatPostDate(dateString: string | Date): string {
   return dateFormatter.format(new Date(dateString));
}
