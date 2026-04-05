"use client";

import { useEffect, useRef, useState } from "react";

export function useAnimatedCounter(target: number, duration = 800): number {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);
  const frame = useRef(0);

  useEffect(() => {
    const from = prev.current;
    prev.current = target;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (target - from) * eased));
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    }

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [target, duration]);

  return display;
}
