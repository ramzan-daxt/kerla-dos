import styles from "./word-label.module.css";
import type { ReactNode } from "react";

export default function WordLabel({ word, classMarker, children }: { word: string; classMarker?: string; children?: ReactNode }) {
  const markers = classMarker?.split("/") ?? [];
  if (!markers.length || markers.some(marker => !["ву", "йу", "ду", "бу"].includes(marker))) return <>{children ?? word}</>;
  const stacked = markers.length > 1 || word.length > 14;
  return <span className={`${styles.label} ${stacked ? styles.stacked : ""}`}><span className={styles.word}>{children ?? word}</span><span className={styles.markers} aria-label={`Класс: ${markers.join(" или ")}`}>{markers.map(marker => <sup className={styles.marker} data-class={marker} key={marker}>{marker}</sup>)}</span></span>;
}
