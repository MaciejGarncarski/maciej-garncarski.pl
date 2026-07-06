import { useCallback, useEffect, useRef, useState } from "react";

type ModalState = "closed" | "entering" | "open" | "closing";

export function useBlogSearch() {
   const triggerRef = useRef<HTMLButtonElement>(null);
   const inputRef = useRef<HTMLInputElement>(null);
   const closeTimerRef = useRef<number>(0);

   const [state, setState] = useState<ModalState>("closed");

   const isOpenRef = useRef(false);
   isOpenRef.current = state !== "closed";

   const openModal = useCallback(() => {
      setState("entering");
      requestAnimationFrame(() => {
         setState("open");
         inputRef.current?.focus();
      });
      document.body.style.overflow = "hidden";
   }, []);

   const closeModal = useCallback(() => {
      setState("closing");
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = window.setTimeout(() => {
         setState("closed");
         triggerRef.current?.focus();
      }, 200);
      document.body.style.overflow = "";
   }, []);

   useEffect(() => {
      const handler = (e: KeyboardEvent) => {
         if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            if (!isOpenRef.current) openModal();
         }
         if (e.key === "Escape" && isOpenRef.current) closeModal();
      };
      document.addEventListener("keydown", handler);
      return () => document.removeEventListener("keydown", handler);
   }, [openModal, closeModal]);

   useEffect(() => {
      return () => {
         window.clearTimeout(closeTimerRef.current);
         document.body.style.overflow = "";
      };
   }, []);

   const showResultClasses = state === "open";

   return { triggerRef, inputRef, state, openModal, closeModal, showResultClasses };
}
