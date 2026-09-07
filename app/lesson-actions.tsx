"use client";
import { useLayoutEffect, useRef, type ReactNode } from "react";

export default function LessonActions({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const dock = ref.current;
    const area = dock?.closest<HTMLElement>(".game-area");
    if (!dock || !area) return;
    const update = () => area.style.setProperty("--lesson-dock-height", `${dock.getBoundingClientRect().height}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(dock);
    return () => { observer.disconnect(); area.style.removeProperty("--lesson-dock-height"); };
  }, []);
  return <div ref={ref} className="lesson-action-dock">{children}</div>;
}
