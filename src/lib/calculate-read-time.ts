export function calculateReadingTime(mdxContent: string) {
   const wordsPerMinute = 220;

   const text = mdxContent.replace(/<\/?[^>]+(>|$)/g, "");
   const wordCount = text.split(/\s+/).filter((word: string) => word.length > 0).length;

   const readingTime = Math.ceil(wordCount / wordsPerMinute);

   return readingTime;
}
