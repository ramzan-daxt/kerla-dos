import styles from "./word-label.module.css";

export default function WordLabel({ word, classMarker }: { word: string; classMarker?: string }) {
  if (!classMarker) return <>{word}</>;
  return <span className={styles.label}>{word}{classMarker && <sup className={styles.marker}>[{classMarker}]</sup>}</span>;
}
