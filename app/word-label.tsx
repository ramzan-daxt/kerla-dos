import styles from "./word-label.module.css";
import type { ReactNode } from "react";

export default function WordLabel({ word, classMarker, children }: { word: string; classMarker?: string; children?: ReactNode }) {
  if (!classMarker || !["ву", "йу", "ду", "бу"].includes(classMarker)) return <>{children ?? word}</>;
  return <span className={styles.label}><span className={styles.word}>{children ?? word}</span><sup className={styles.marker} data-class={classMarker} aria-label={`Класс: ${classMarker}`}>{classMarker}</sup></span>;
}
