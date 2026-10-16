"use client";
import { useCallback, useEffect, useState } from "react";
import { defaultSettings, type Settings } from "../settings";
import type { LessonPosition } from "../types";
import { browserStorage, readProgress, writeProgress } from "../lib/progress-storage.mjs";

type Progress = {
  stars: number;
  premium: boolean;
  settings: Settings;
  favorites: string[];
  learnedWords: string[];
  lastLesson: LessonPosition | null;
};

const initialProgress: Progress = {
  stars: 0, premium: false, settings: defaultSettings,
  favorites: [], learnedWords: [], lastLesson: null,
};

export function useLearningProgress() {
  const [progress, setProgress] = useState<Progress>(initialProgress);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // The static HTML and first render share defaults. Read browser-only data after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(readProgress(browserStorage(), defaultSettings) as Progress);
    setLoaded(true);
  }, []);

  useEffect(() => {
    // Never overwrite saved data with first-render defaults.
    if (loaded) writeProgress(browserStorage(), progress);
  }, [loaded, progress]);

  const update = useCallback(<K extends keyof Progress>(
    key: K, value: Progress[K] | ((previous: Progress[K]) => Progress[K]),
  ) => {
    setProgress(previous => ({
      ...previous,
      [key]: typeof value === "function" ? value(previous[key]) : value,
    }));
  }, []);

  return { progress, update };
}
