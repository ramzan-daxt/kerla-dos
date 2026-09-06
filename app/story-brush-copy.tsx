"use client";
import { useLayoutEffect, useRef, type ReactNode } from "react";

/** Center the visible lines as a group while preserving their left alignment. */
export default function StoryBrushCopy({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    let active = true;
    const measure = () => {
      if (!active) return;
      const box = element.getBoundingClientRect();
      if (!box.width) return;
      let lineWidth = 0;
      for (const paragraph of element.querySelectorAll("p")) {
        const range = document.createRange();
        range.selectNodeContents(paragraph);
        for (const rect of range.getClientRects()) {
          lineWidth = Math.max(lineWidth, rect.right - box.left);
        }
      }
      // Relative positioning does not alter wrapping or the page's height.
      element.style.left = `${Math.max(0, (box.width - lineWidth) / 2)}px`;
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
    void document.fonts.ready.then(measure);
    return () => { active = false; observer.disconnect(); };
  }, [children]);
  return <div ref={ref} className="story-brush-copy">{children}</div>;
}
