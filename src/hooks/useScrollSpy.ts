"use client";

import { useEffect, useState } from "react";

export function useScrollSpy(ids: string[], offset = 120): number {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    function onScroll() {
      const scrollPos = window.scrollY + offset;

      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveIndex(i);
          return;
        }
      }
      setActiveIndex(0);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids, offset]);

  return activeIndex;
}
