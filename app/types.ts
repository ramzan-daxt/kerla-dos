export type Word = {
  id: string;
  chechen: string;
  russian: string;
  visual: string;
  color?: string;
  example?: string;
  image?: string;
  audioSrc?: string;
  classMarker?: string;
};
export type Category = {
  id: string;
  title: string;
  russian: string;
  icon: string;
  accent: string;
  words: Word[];
};
export type LessonPosition = { categoryId: string; index: number };
