import { useCallback, useEffect, useRef, useState } from "react";

export function useBlogSearch() {
   const triggerRef = useRef<HTMLButtonElement>(null);
   const inputRef = useRef<HTMLInputElement>(null);
   const closeTimerRef = useRef<number>(0);

   const [shouldRender, setShouldRender] = useState(false);
   const [visible, setVisible] = useState(false);

   const isOpenRef = useRef(false);
   isOpenRef.current = shouldRender;

   const openModal = useCallback(() => {
      setShouldRender(true);
      requestAnimationFrame(() => {
         setVisible(true);
         inputRef.current?.focus();
      });
      document.body.style.overflow = "hidden";
   }, []);

   const closeModal = useCallback(() => {
      setVisible(false);
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = window.setTimeout(() => {
         setShouldRender(false);
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

   const showResultClasses = shouldRender && visible;

   return { triggerRef, inputRef, shouldRender, visible, openModal, closeModal, showResultClasses };
}
