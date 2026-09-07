import styles from "./word-label.module.css";
import type { ReactNode } from "react";

export default function WordLabel({ word, classMarker, children }: { word: string; classMarker?: string; children?: ReactNode }) {
  const markers = classMarker?.split("/") ?? [];
  if (!markers.length || markers.some(marker => !["ву", "йу", "ду", "бу"].includes(marker))) return <>{children ?? word}</>;
  return <span className={styles.label}><span className={styles.word}>{children ?? word}</span><span className={styles.markers} aria-label={`Класс: ${markers.join(" или ")}`}>{markers.map(marker => <sup className={styles.marker} data-class={marker} key={marker}>{marker}</sup>)}</span></span>;
}
