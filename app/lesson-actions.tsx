"use client";
import { useLayoutEffect, useRef, type ReactNode } from "react";

export default function LessonActions({ children }: { children: ReactNode }) {
  const dock = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const actions = dock.current;
    const area = actions?.parentElement;
    const grid = area?.querySelector<HTMLElement>(".answer-grid.picture-only");
    if (!actions || !area || !grid) return;
    const fit = () => {
      if (!matchMedia("(max-width: 760px) and (orientation: portrait)").matches) {
        grid.style.removeProperty("--available-answer-height");
        return;
      }
      const viewport = window.visualViewport?.height ?? window.innerHeight;
      // Document position stays stable when the user scrolls. Reserve room for
      // result feedback, the button shadow and the real iOS safe-area padding.
      const top = grid.getBoundingClientRect().top + window.scrollY;
      const bottom = parseFloat(getComputedStyle(area).paddingBottom) || 0;
      const gap = parseFloat(getComputedStyle(grid).rowGap) || 12;
      const actionsHeight = Math.max(104, actions.getBoundingClientRect().height);
      const height = Math.floor((viewport - top - bottom - actionsHeight - gap - 20) / 2);
      grid.style.setProperty("--available-answer-height", `${Math.max(100, Math.min(230, height))}px`);
    };
    const observer = new ResizeObserver(fit);
    observer.observe(area);
    observer.observe(document.documentElement);
    window.addEventListener("resize", fit);
    window.visualViewport?.addEventListener("resize", fit);
    document.fonts.ready.then(fit);
    fit();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fit);
      window.visualViewport?.removeEventListener("resize", fit);
      grid.style.removeProperty("--available-answer-height");
    };
  }, []);
  return <div ref={dock} className="lesson-action-dock">{children}</div>;
}
