import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
   getBodyPreview,
   getQueryTerms,
   type IndexedItem,
   normalizeValue,
   type RankedResult,
   rankItem,
   SEARCH_DEBOUNCE_MS,
   SEARCH_LIMIT,
   type SearchItem,
   stripMarkdown,
} from "@/lib/blog-search-utils";

export function useBlogSearchResults({ items }: { items: SearchItem[] }) {
   const resultsListRef = useRef<HTMLUListElement>(null);
   const debounceTimerRef = useRef<number>(0);

   const [query, setQuery] = useState("");
   const [debouncedQuery, setDebouncedQuery] = useState("");

   const indexedItems = useMemo<IndexedItem[]>(
      () =>
         items.map((item, index) => ({
            ...item,
            index,
            normalized: {
               title: normalizeValue(item.title),
               description: normalizeValue(item.description),
               body: normalizeValue(stripMarkdown(item.body)),
               tags: item.tags.map((tag) => normalizeValue(tag)),
            },
         })),
      [items],
   );

   const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = window.setTimeout(() => {
         setDebouncedQuery(value);
      }, SEARCH_DEBOUNCE_MS);
   }, []);

   const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;
      const firstLink = resultsListRef.current?.querySelector("a");
      if (firstLink instanceof HTMLAnchorElement) {
         e.preventDefault();
         window.location.href = firstLink.href;
      }
   }, []);

   const trimmedQuery = debouncedQuery.trim();
   const normalizedQuery = normalizeValue(trimmedQuery);
   const queryTerms = getQueryTerms(trimmedQuery);

   const rankedResults = useMemo<RankedResult[]>(() => {
      if (!normalizedQuery) {
         return indexedItems
            .map((item) => ({
               id: item.id,
               index: item.index,
               title: item.title,
               description: item.description,
               body: item.body,
               normalizedBody: item.normalized.body,
               tags: item.tags,
               score: 1,
               bodyPreview: null as { snippet: string; matchTerm: string } | null,
            }))
            .slice(0, SEARCH_LIMIT);
      }

      return indexedItems
         .map((item) => {
            const score = rankItem(item, normalizedQuery, queryTerms);
            return {
               id: item.id,
               index: item.index,
               title: item.title,
               description: item.description,
               body: item.body,
               normalizedBody: item.normalized.body,
               tags: item.tags,
               score,
               bodyPreview:
                  score > 0
                     ? getBodyPreview(item.body, item.normalized.body, normalizedQuery, queryTerms)
                     : null,
            };
         })
         .filter((r) => r.score > 0)
         .sort((a, b) => b.score - a.score || a.index - b.index)
         .slice(0, SEARCH_LIMIT);
   }, [normalizedQuery, queryTerms, indexedItems]);

   useEffect(() => {
      return () => {
         window.clearTimeout(debounceTimerRef.current);
      };
   }, []);

   return {
      resultsListRef,
      query,
      setQuery,
      setDebouncedQuery,
      handleQueryChange,
      handleKeyDown,
      rankedResults,
      normalizedQuery,
      indexedItems,
   };
}
