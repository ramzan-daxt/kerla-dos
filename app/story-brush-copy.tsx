"use client";
import { useLayoutEffect, useRef, type ReactNode } from "react";

/** Center each paragraph's visible lines independently, keeping lines left-aligned. */
export default function StoryBrushCopy({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    // Clear the former shared offset when an open reader is hot-updated.
    element.style.removeProperty("left");
    let active = true;
    const measure = () => {
      if (!active) return;
      for (const paragraph of element.querySelectorAll("p")) {
        const box = paragraph.getBoundingClientRect();
        if (!box.width) continue;
        let lineWidth = 0;
        const range = document.createRange();
        range.selectNodeContents(paragraph);
        for (const rect of range.getClientRects()) {
          lineWidth = Math.max(lineWidth, rect.right - box.left);
        }
        // Relative positioning preserves wrapping and paragraph/page heights.
        paragraph.style.left = `${Math.max(0, (box.width - lineWidth) / 2)}px`;
      }
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    for (const paragraph of element.querySelectorAll("p")) observer.observe(paragraph);
    measure();
    void document.fonts.ready.then(measure);
    return () => { active = false; observer.disconnect(); };
  }, [children]);
  return <div ref={ref} className="story-brush-copy">{children}</div>;
}
