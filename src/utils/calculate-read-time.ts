export function calculateReadingTime(mdxContent: string) {
  const wordsPerMinute = 200;

  const text = mdxContent.replace(/<\/?[^>]+(>|$)/g, "");
  const wordCount = text
    .split(/\s+/)
    .filter((word: any) => word.length > 0).length;

  const readingTime = Math.ceil(wordCount / wordsPerMinute);

  return readingTime;
}
