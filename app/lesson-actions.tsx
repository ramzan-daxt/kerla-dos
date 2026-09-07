"use client";
import type { ReactNode } from "react";

export default function LessonActions({ children }: { children: ReactNode }) {
  return <div className="lesson-action-dock">{children}</div>;
}
