import type { PostWithReadingTime } from "@/lib/get-posts";

export function calculateReadingTime(mdxContent: string, wordsPerMinute: number = 210) {
   const text = mdxContent.replace(/<\/?[^>]+(>|$)/g, "");
   const wordCount = text.split(/\s+/).filter(Boolean).length;
   return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export function addReadingTime<T extends { body?: string }>(entry: T): T & { readingTime: number } {
   return { ...entry, readingTime: calculateReadingTime(entry.body ?? "") };
}

export function sortTags<T extends { tags?: string[] }>(entry: T): T & { tags: string[] } {
   return {
      ...entry,
      tags:
         entry.tags?.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" })) ?? [],
   };
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

const allTags = new Set<string>();

export async function collectAllTags(allPosts: PostWithReadingTime[]) {
   allPosts.forEach((post) => {
      post.data.tags.forEach((tag: string) => {
         allTags.add(tag);
      });
   });

   return Array.from(allTags).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" }),
   );
}
