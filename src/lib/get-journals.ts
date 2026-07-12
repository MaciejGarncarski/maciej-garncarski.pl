import { getCollection } from "astro:content";
import { addReadingTime } from "@/lib/utils";

export type JournalEntry = Awaited<ReturnType<typeof getJournals>>[number];

export async function getJournals() {
   const collection = await getCollection("dzienniki", ({ data }) => data.public && !data.draft);
   return collection.map(addReadingTime);
}

export async function getJournalsSorted() {
   const collection = await getJournals();
   return collection.toSorted((a, b) => {
      const aTime = a.data.updatedDate ?? a.data.publishedDate;
      const bTime = b.data.updatedDate ?? b.data.publishedDate;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
   });
}
