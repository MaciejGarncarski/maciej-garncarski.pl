import { DemoContainer } from "@/components/blog/demo-container";
import { useState, useTransition, type ChangeEvent } from "react";

const PRODUCTS = ["lampa", "poduszka", "lodówka", "biurko", "krzesło", "szafa"];

export function DemoComponent() {
   const [query, setQuery] = useState("");
   const [results, setResults] = useState<string[]>(PRODUCTS);
   const [isPending, startTransition] = useTransition();

   const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setQuery(value);

      startTransition(async () => {
         await new Promise((res) => setTimeout(res, 500));
         const filtered = PRODUCTS.filter((product) =>
            product.toLowerCase().includes(value.toLowerCase()),
         );

         startTransition(() => {
            setResults(filtered);
         });
      });
   };

   return (
      <div className="flex flex-col items-center justify-center my-2">
         <input
            type="text"
            className="border px-3 py-2 w-54 bg-background-secondary rounded-sm border-accent/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-transparent transition"
            value={query}
            onChange={handleSearch}
            placeholder="Szukaj produktów..."
         />
         {isPending && <p>Aktualizowanie wyników...</p>}
         {!isPending && (
            <ul>
               {results.map((result) => (
                  <li key={result}>{result}</li>
               ))}
            </ul>
         )}
      </div>
   );
}
