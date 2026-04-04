type SearchItem = {
   id: string;
   title: string;
   description: string;
   tags: string[];
   body: string;
};

type RankedResult = {
   element: HTMLLIElement;
   title: string;
   description: string;
   body: string;
   tags: string[];
   score: number;
};

type SearchDom = {
   root: HTMLElement;
   trigger: HTMLButtonElement;
   closeButton: HTMLButtonElement;
   backdrop: HTMLDivElement;
   dialog: HTMLDivElement;
   panel: HTMLDivElement;
   input: HTMLInputElement;
   meta: HTMLParagraphElement;
   resultsList: HTMLUListElement;
   emptyState: HTMLParagraphElement;
};

const SEARCH_LIMIT = 10;
const SEARCH_DEBOUNCE_MS = 260;

function normalizeValue(value: string) {
   return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
}

function escapeHtml(value: string) {
   return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
}

function highlightText(text: string, normalizedQuery: string) {
   if (!normalizedQuery) return escapeHtml(text);

   const normalizedText = normalizeValue(text);
   let cursor = 0;
   let index = normalizedText.indexOf(normalizedQuery);
   let html = "";

   while (index !== -1) {
      html += escapeHtml(text.slice(cursor, index));
      html += '<mark class="bg-amber-400 rounded-xs">';
      html += escapeHtml(text.slice(index, index + normalizedQuery.length));
      html += "</mark>";
      cursor = index + normalizedQuery.length;
      index = normalizedText.indexOf(normalizedQuery, cursor);
   }

   html += escapeHtml(text.slice(cursor));
   return html;
}

function stripMarkdown(value: string) {
   return value
      .replace(/^---[\s\S]*?---\s*/m, " ")
      .replace(/^\s*import\s+.+$/gm, " ")
      .replace(/^\s*export\s+.+$/gm, " ")
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/<([A-Z][A-Za-z0-9._-]*)(?:\s[^>]*)?>[\s\S]*?<\/\1>/g, " ")
      .replace(/<([A-Z][A-Za-z0-9._-]*)(?:\s[^>]*)?\/>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "$1")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
      .replace(/^\s{0,3}#{1,6}\s+/gm, "")
      .replace(/^\s{0,3}[-*+]\s+/gm, "")
      .replace(/^\s*\d+\.\s+/gm, "")
      .replace(/^\s{0,3}>\s?/gm, "")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/__([^_]+)__/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/_([^_]+)_/g, "$1")
      .replace(/~~([^~]+)~~/g, "$1")
      .replace(/\{[^{}]*\}/g, " ")
      .replace(/\n{2,}/g, "\n")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\s+\n/g, "\n")
      .replace(/\n\s+/g, "\n")
      .trim();
}

function getQueryTerms(query: string) {
   return normalizeValue(query)
      .split(/\s+/)
      .filter((term) => term.length > 0);
}

function rankItem(item: SearchItem, normalizedQuery: string, queryTerms: string[]) {
   if (!normalizedQuery || queryTerms.length === 0) return 1;

   const normalizedTitle = normalizeValue(item.title);
   const normalizedDescription = normalizeValue(item.description);
   const normalizedTags = item.tags.map((tag) => normalizeValue(tag));
   const normalizedBody = normalizeValue(item.body);

   let score = 0;

   for (const term of queryTerms) {
      let termScore = 0;

      if (normalizedTitle.startsWith(term)) termScore += 120;
      else if (normalizedTitle.includes(term)) termScore += 85;

      if (normalizedTags.some((tag) => tag.startsWith(term))) termScore += 70;
      else if (normalizedTags.some((tag) => tag.includes(term))) termScore += 50;

      if (normalizedDescription.includes(term)) termScore += 30;
      if (normalizedBody.includes(term)) termScore += 12;

      if (termScore === 0) {
         return 0;
      }

      score += termScore;
   }

   if (normalizedTitle.includes(normalizedQuery)) score += 35;
   if (normalizedDescription.includes(normalizedQuery)) score += 20;
   if (normalizedBody.includes(normalizedQuery)) score += 8;

   return score;
}

function getBodyPreview(body: string, normalizedQuery: string, queryTerms: string[]) {
   if (!normalizedQuery || queryTerms.length === 0) {
      return null;
   }

   const normalizedBody = normalizeValue(body);

   let matchTerm = normalizedQuery;
   let matchIndex = normalizedBody.indexOf(normalizedQuery);

   if (matchIndex === -1) {
      const fallbackTerm = queryTerms.find((term) => normalizedBody.includes(term));
      if (!fallbackTerm) return null;

      matchTerm = fallbackTerm;
      matchIndex = normalizedBody.indexOf(fallbackTerm);
   }

   const previewRadius = 80;
   const start = Math.max(0, matchIndex - previewRadius);
   const end = Math.min(body.length, matchIndex + matchTerm.length + previewRadius);

   const prefix = start > 0 ? "..." : "";
   const suffix = end < body.length ? "..." : "";
   const snippet = `${prefix}${body.slice(start, end).trim()}${suffix}`;

   return {
      snippet,
      matchTerm,
   };
}

function getSearchDom(root: HTMLElement): SearchDom | null {
   const trigger = root.querySelector("[data-search-trigger]");
   const closeButton = root.querySelector("[data-search-close]");
   const backdrop = root.querySelector("[data-search-backdrop]");
   const dialog = root.querySelector("[data-search-dialog]");
   const panel = root.querySelector("[data-search-panel]");
   const input = root.querySelector("[data-search-input]");
   const meta = root.querySelector("[data-search-meta]");
   const resultsList = root.querySelector("[data-search-results]");
   const emptyState = root.querySelector("[data-search-empty]");

   if (
      !(trigger instanceof HTMLButtonElement) ||
      !(closeButton instanceof HTMLButtonElement) ||
      !(backdrop instanceof HTMLDivElement) ||
      !(dialog instanceof HTMLDivElement) ||
      !(panel instanceof HTMLDivElement) ||
      !(input instanceof HTMLInputElement) ||
      !(meta instanceof HTMLParagraphElement) ||
      !(resultsList instanceof HTMLUListElement) ||
      !(emptyState instanceof HTMLParagraphElement)
   ) {
      return null;
   }

   return {
      root,
      trigger,
      closeButton,
      backdrop,
      dialog,
      panel,
      input,
      meta,
      resultsList,
      emptyState,
   };
}

function parseResultItem(element: HTMLLIElement): SearchItem {
   return {
      id: "",
      title: element.dataset.title ?? "",
      description: element.dataset.description ?? "",
      tags: JSON.parse(element.dataset.tags ?? "[]") as string[],
      body: stripMarkdown(element.dataset.body ?? ""),
   };
}

function updateResultContent(result: RankedResult, normalizedQuery: string, queryTerms: string[]) {
   const titleElement = result.element.querySelector("[data-search-title]");
   const descriptionElement = result.element.querySelector("[data-search-description]");
   const tagsElement = result.element.querySelector("[data-search-tags]");

   if (titleElement instanceof HTMLParagraphElement) {
      titleElement.innerHTML = highlightText(result.title, normalizedQuery);
   }

   if (descriptionElement instanceof HTMLParagraphElement) {
      const bodyPreview = getBodyPreview(result.body, normalizedQuery, queryTerms);

      if (bodyPreview) {
         descriptionElement.innerHTML = highlightText(bodyPreview.snippet, bodyPreview.matchTerm);
      } else {
         descriptionElement.innerHTML = highlightText(result.description, normalizedQuery);
      }
   }

   if (tagsElement instanceof HTMLDivElement) {
      const tagPills = Array.from(tagsElement.querySelectorAll("[data-search-tag]")).filter(
         (tag): tag is HTMLElement => tag instanceof HTMLElement,
      );

      for (const tagPill of tagPills) {
         const tagValue = tagPill.dataset.tagValue ?? "";
         const isMatch =
            normalizedQuery.length > 0 && normalizeValue(tagValue).includes(normalizedQuery);

         tagPill.classList.toggle("text-foreground-secondary", !isMatch);
         tagPill.classList.toggle("bg-accent/30", isMatch);
         tagPill.classList.toggle("text-foreground", isMatch);
      }
   }
}

export function setupBlogSearch(): () => void {
   const root = document.querySelector("[data-blog-search]");
   if (!(root instanceof HTMLElement) || root.dataset.searchReady === "true") {
      return () => {};
   }
   root.dataset.searchReady = "true";

   const dom = getSearchDom(root);
   if (!dom) {
      root.removeAttribute("data-search-ready");
      return () => {};
   }

   const resultItems = Array.from(dom.resultsList.querySelectorAll("[data-search-item]")).filter(
      (item): item is HTMLLIElement => item instanceof HTMLLIElement,
   );

   const totalItems = resultItems.length;
   let isOpen = false;
   let debounceId = 0;
   let lastRenderedQuery = "";

   const controller = new AbortController();
   const { signal } = controller;

   const openModal = () => {
      if (isOpen) return;

      isOpen = true;
      dom.trigger.setAttribute("aria-expanded", "true");
      dom.backdrop.hidden = false;
      dom.dialog.hidden = false;
      document.body.style.overflow = "hidden";

      requestAnimationFrame(() => {
         dom.backdrop.classList.remove("pointer-events-none", "opacity-0");
         dom.dialog.classList.remove("pointer-events-none", "opacity-0");
         dom.panel.classList.remove("translate-y-3", "scale-[0.985]", "opacity-0");
         dom.input.focus();
      });
   };

   const closeModal = () => {
      if (!isOpen) return;

      isOpen = false;
      dom.trigger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      dom.backdrop.classList.add("pointer-events-none", "opacity-0");
      dom.dialog.classList.add("pointer-events-none", "opacity-0");
      dom.panel.classList.add("translate-y-3", "scale-[0.985]", "opacity-0");

      window.setTimeout(() => {
         if (isOpen) return;
         dom.backdrop.hidden = true;
         dom.dialog.hidden = true;
      }, 200);

      dom.trigger.focus();
   };

   const renderResults = (query: string) => {
      const startTime = performance.now();
      lastRenderedQuery = query;
      const normalizedQuery = normalizeValue(query.trim());
      const queryTerms = getQueryTerms(query.trim());

      const rankedItems: RankedResult[] = resultItems
         .map((element) => {
            const parsed = parseResultItem(element);
            return {
               element,
               title: parsed.title,
               description: parsed.description,
               body: parsed.body,
               tags: parsed.tags,
               score: rankItem(parsed, normalizedQuery, queryTerms),
            };
         })
         .filter(({ score }) => score > 0)
         .sort((left, right) => right.score - left.score);

      const visibleItems = rankedItems.slice(0, SEARCH_LIMIT);

      for (const item of resultItems) {
         item.hidden = true;
      }

      for (const result of visibleItems) {
         result.element.hidden = false;
         dom.resultsList.append(result.element);
         updateResultContent(result, normalizedQuery, queryTerms);
      }

      const showing = visibleItems.length;
      const durationMs = Math.max(0, Math.round((performance.now() - startTime) * 10) / 10);
      const durationLabel = `Znaleziono w ${durationMs} ms`;

      if (normalizedQuery) {
         dom.meta.textContent = `Wyniki: ${showing} z ${totalItems} • ${durationLabel}`;
      } else {
         dom.meta.textContent = "";
      }

      dom.emptyState.classList.toggle("hidden", showing !== 0);
   };

   const scheduleRender = () => {
      window.clearTimeout(debounceId);
      const nextQuery = dom.input.value;

      if (nextQuery === lastRenderedQuery) {
         return;
      }

      debounceId = window.setTimeout(() => {
         window.requestAnimationFrame(() => {
            renderResults(nextQuery);
         });
      }, SEARCH_DEBOUNCE_MS);
   };

   dom.trigger.addEventListener("click", openModal, { signal });
   dom.closeButton.addEventListener("click", closeModal, { signal });
   dom.backdrop.addEventListener("click", closeModal, { signal });
   dom.dialog.addEventListener(
      "click",
      (event) => {
         if (event.target === dom.dialog) {
            closeModal();
         }
      },
      { signal },
   );

   dom.input.addEventListener("input", scheduleRender, { signal });
   dom.input.addEventListener(
      "keydown",
      (event) => {
         if (event.key !== "Enter") return;

         const firstLink = dom.resultsList.querySelector("a");
         if (!(firstLink instanceof HTMLAnchorElement)) return;

         event.preventDefault();
         window.location.href = firstLink.href;
      },
      { signal },
   );

   document.addEventListener(
      "keydown",
      (event) => {
         if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
            event.preventDefault();
            openModal();
            return;
         }

         if (event.key === "Escape") {
            closeModal();
         }
      },
      { signal },
   );

   renderResults("");

   return () => {
      window.clearTimeout(debounceId);
      closeModal();
      root.removeAttribute("data-search-ready");
      controller.abort();
   };
}
