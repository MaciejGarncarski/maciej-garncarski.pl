const formatter = new Intl.DateTimeFormat("pl-PL", {
   year: "numeric",
   month: "long",
   day: "numeric",
});

export function formatPostDate(dateString: string | Date): string {
   return formatter.format(new Date(dateString));
}
