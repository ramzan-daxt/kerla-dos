"use client";

import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { LearningItem } from "./home-extras";
import AppIcon from "./ui-icon";

type GameScreen = "hub" | "word" | "mosaic";
type Result = "idle" | "right" | "wrong";
type LetterTile = { id: string; value: string };
type PieceDrag = { position: number; startX: number; startY: number; x: number; y: number };

const mosaicThemes = [
  {
    id: "architecture",
    title: "Нохчийн гӀишлош",
    note: "Башенаш, эвланаш, цӀенош",
    puzzles: [
      { title: "Ламанан йурт", image: "/illustrations/alphabet/village.png" },
      { title: "ГӀала", image: "/illustrations/alphabet/city.png" },
      { title: "ЦӀа", image: "/illustrations/alphabet/house.png" },
    ],
  },
  {
    id: "fairytale-scenes",
    title: "Туьйран сурташ",
    note: "Дуьззина сюжетан сурташ",
    puzzles: [
      { title: "Ловзуш Ӏахарш", image: "/stories/borz-ka/scene-01.png" },
      { title: "Борз а, цхьогал а", image: "/stories/borz-ka/scene-06.png" },
      { title: "Къена ка а, жӀаьла а", image: "/stories/borz-ka/scene-11.png" },
    ],
  },
] as const;

function shuffled<T>(values: T[]): T[] {
  const next = [...values];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function makeTiles(word: string): LetterTile[] {
  return shuffled(
    [...word.replace(/\s/g, "")].map((value, index) => ({
      id: `${index}-${value}`,
      value,
    })),
  );
}

function makePuzzleOrder(size = 9): number[] {
  const solved = Array.from({ length: size }, (_, index) => index);
  let next = shuffled(solved);
  if (next.every((value, index) => value === index)) next = [...next.slice(1), next[0]];
  return next;
}

function puzzlePiecePath(piece: number, columns: number): string {
  const row = Math.floor(piece / columns);
  const column = piece % columns;
  const lastRow = 2;
  const right = column === columns - 1 ? 0 : (row + column) % 2 === 0 ? 1 : -1;
  const bottom = row === lastRow ? 0 : (row * columns + column) % 2 === 0 ? 1 : -1;
  const top = row === 0 ? 0 : -(((row - 1) * columns + column) % 2 === 0 ? 1 : -1);
  const left = column === 0 ? 0 : -((row + column - 1) % 2 === 0 ? 1 : -1);
  const depth = 14;
  const t = top * depth;
  const r = right * depth;
  const b = bottom * depth;
  const l = left * depth;
  return [
    "M 0 0 H 35",
    top ? `C 39 0 38 ${t} 50 ${t} C 62 ${t} 61 0 65 0` : "H 65",
    "H 100 V 35",
    right ? `C 100 39 ${100 + r} 38 ${100 + r} 50 C ${100 + r} 62 100 61 100 65` : "V 65",
    "V 100 H 65",
    bottom ? `C 61 100 62 ${100 + b} 50 ${100 + b} C 38 ${100 + b} 39 100 35 100` : "H 35",
    "H 0 V 65",
    left ? `C 0 61 ${l} 62 ${l} 50 C ${l} 38 0 39 0 35` : "V 35",
    "V 0 Z",
  ].join(" ");
}

export default function GameCenter({ items, onBack }: { items: LearningItem[]; onBack: () => void }) {
  const wordItems = useMemo(
    () => items.filter((item) => item.image && [...item.word.replace(/\s/g, "")].length >= 2 && [...item.word.replace(/\s/g, "")].length <= 9),
    [items],
  );
  const [screen, setScreen] = useState<GameScreen>("hub");
  const [wordIndex, setWordIndex] = useState(0);
  const wordItem = wordItems[wordIndex % Math.max(1, wordItems.length)];
  const [letters, setLetters] = useState<LetterTile[]>(() => makeTiles(wordItems[0]?.word || "дош"));
  const [chosen, setChosen] = useState<string[]>([]);
  const [wordResult, setWordResult] = useState<Result>("idle");
  const [themeIndex, setThemeIndex] = useState<number | null>(null);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [difficulty, setDifficulty] = useState(9);
  const [order, setOrder] = useState<number[]>(() => makePuzzleOrder(9));
  const [dragging, setDragging] = useState<PieceDrag | null>(null);
  const dragRef = useRef<PieceDrag | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [mosaicResult, setMosaicResult] = useState<Result>("idle");
  const [previewUses, setPreviewUses] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);

  const theme = themeIndex === null ? null : mosaicThemes[themeIndex];
  const puzzle = theme?.puzzles[puzzleIndex % theme.puzzles.length];
  const solved = order.every((value, index) => value === index);
  const puzzleColumns = difficulty / 3;

  function returnOneLevel() {
    if (screen === "hub") return onBack();
    if (screen === "mosaic" && themeIndex !== null) {
      setThemeIndex(null);
      setDragging(null);
      dragRef.current = null;
      setMosaicResult("idle");
      setPreviewOpen(false);
      return;
    }
    setScreen("hub");
  }

  function openWordGame() {
    let nextIndex = 0;
    if (wordItems.length > 1) {
      do {
        nextIndex = Math.floor(Math.random() * wordItems.length);
      } while (nextIndex === wordIndex);
    }
    const nextItem = wordItems[nextIndex];
    setWordIndex(nextIndex);
    setLetters(makeTiles(nextItem?.word || "дош"));
    setChosen([]);
    setWordResult("idle");
    setScreen("word");
  }

  function nextWord() {
    if (!wordItems.length) return;
    const nextIndex = (wordIndex + 1) % wordItems.length;
    setWordIndex(nextIndex);
    setLetters(makeTiles(wordItems[nextIndex].word));
    setChosen([]);
    setWordResult("idle");
  }

  function checkWord() {
    if (!wordItem) return;
    const answer = chosen.map((id) => letters.find((letter) => letter.id === id)?.value || "").join("");
    setWordResult(answer.toLocaleLowerCase() === wordItem.word.replace(/\s/g, "").toLocaleLowerCase() ? "right" : "wrong");
  }

  function chooseTheme(index: number) {
    setThemeIndex(index);
    setPuzzleIndex(0);
    setOrder(makePuzzleOrder(difficulty));
    setDragging(null);
    dragRef.current = null;
    setMosaicResult("idle");
    setPreviewUses(0);
    setPreviewOpen(false);
  }

  function choosePuzzle(index: number) {
    setPuzzleIndex(index);
    setOrder(makePuzzleOrder(difficulty));
    setDragging(null);
    dragRef.current = null;
    setMosaicResult("idle");
    setPreviewUses(0);
    setPreviewOpen(false);
  }

  function startPieceDrag(event: ReactPointerEvent<HTMLButtonElement>, position: number) {
    if (mosaicResult === "right") return;
    const next = { position, startX: event.clientX, startY: event.clientY, x: 0, y: 0 };
    dragRef.current = next;
    setDragging(next);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function movePieceDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    const current = dragRef.current;
    if (!current) return;
    event.preventDefault();
    const next = {
      ...current,
      x: event.clientX - current.startX,
      y: event.clientY - current.startY,
    };
    dragRef.current = next;
    setDragging(next);
  }

  function finishPieceDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    const current = dragRef.current;
    dragRef.current = null;
    setDragging(null);
    if (!current || !boardRef.current) return;
    const bounds = boardRef.current.getBoundingClientRect();
    const column = Math.floor(((event.clientX - bounds.left) / bounds.width) * puzzleColumns);
    const row = Math.floor(((event.clientY - bounds.top) / bounds.height) * 3);
    if (column < 0 || column >= puzzleColumns || row < 0 || row >= 3) return;
    const target = row * puzzleColumns + column;
    if (target === current.position || target >= order.length) return;
    setOrder((pieces) => {
      const next = [...pieces];
      [next[current.position], next[target]] = [next[target], next[current.position]];
      return next;
    });
    setMosaicResult("idle");
  }

  function chooseDifficulty(size: number) {
    setDifficulty(size);
    setOrder(makePuzzleOrder(size));
    setDragging(null);
    dragRef.current = null;
    setMosaicResult("idle");
  }

  function openPuzzlePreview() {
    if (previewUses >= 3) return;
    setPreviewUses((current) => current + 1);
    setPreviewOpen(true);
  }

  return (
    <main className="extra-shell games-shell">
      <header>
        <button className="back icon-label" onClick={returnOneLevel} aria-label="Хьалха">
          <AppIcon name="arrow-left" /> <span>Хьалха</span>
        </button>
        <a className="brand" onClick={onBack}>KERLA <i>DOŞ</i></a>
        <span className="games-header-icon"><AppIcon name="puzzle" /></span>
      </header>

      {screen === "hub" && (
        <section className="games-hub">
          <h1>Ловзарш</h1>
          <div className="game-choice-grid">
            <button className="game-choice word-choice" onClick={openWordGame}>
              <span className="game-choice-art">
                {wordItems[0]?.image && <img src={wordItems[0].image} alt="" />}
                <b>Д О Ш</b>
              </span>
              <strong>Дош гулде</strong>
              <small>Элпаш нийса хӀиттаде</small>
            </button>
            <button className="game-choice mosaic-choice" onClick={() => setScreen("mosaic")}>
              <span className="game-choice-art mosaic-preview" aria-hidden="true">
                {[0, 1, 2, 3].map((piece) => <i key={piece} />)}
              </span>
              <strong>Мозаика</strong>
              <small>Сурт дакъошках гулде</small>
            </button>
          </div>
        </section>
      )}

      {screen === "word" && wordItem && (
        <section className="word-builder">
          <small>ДОШ ГУЛДАР</small>
          <h1>Дош гулде</h1>
          <div className="builder-card">
            <img src={wordItem.image} alt="" draggable={false} />
            <div className="answer-slots" aria-label="Жоп">
              {[...wordItem.word.replace(/\s/g, "")].map((_, index) => {
                const tile = letters.find((letter) => letter.id === chosen[index]);
                return <button key={index} onClick={() => setChosen((current) => current.slice(0, index))}>{tile?.value || ""}</button>;
              })}
            </div>
            <div className="letter-bank">
              {letters.map((letter) => (
                <button
                  key={letter.id}
                  disabled={chosen.includes(letter.id)}
                  onClick={() => { setChosen((current) => [...current, letter.id]); setWordResult("idle"); }}
                >{letter.value}</button>
              ))}
            </div>
            <p className={`builder-feedback ${wordResult}`}>
              {wordResult === "right" ? `Нийса! ${wordItem.word}` : wordResult === "wrong" ? "Юха хьажа" : "Элпаш тӀетаӀайе"}
            </p>
            {wordResult === "right" ? (
              <button className="game-main-button" onClick={nextWord}>Кхин дош</button>
            ) : (
              <button className="game-main-button" disabled={chosen.length !== letters.length} onClick={checkWord}>Таллам бе</button>
            )}
          </div>
        </section>
      )}

      {screen === "mosaic" && themeIndex === null && (
        <section className="mosaic-themes">
          <small>МОЗАИКА</small>
          <h1>Тема харжа</h1>
          <div>
            {mosaicThemes.map((item, index) => (
              <button key={item.id} onClick={() => chooseTheme(index)}>
                <img src={item.puzzles[0].image} alt="" />
                <span><strong>{item.title}</strong><small>{item.note}</small></span>
              </button>
            ))}
          </div>
        </section>
      )}

      {screen === "mosaic" && theme && puzzle && (
        <section className="mosaic-game">
          <small>МОЗАИКА · {theme.title}</small>
          <h1>{puzzle.title}</h1>
          <div className="puzzle-picker">
            {theme.puzzles.map((item, index) => (
              <button className={puzzleIndex === index ? "active" : ""} key={item.title} onClick={() => choosePuzzle(index)}>
                <img src={item.image} alt="" /><span>{item.title}</span>
              </button>
            ))}
          </div>
          <div className="mosaic-difficulty" aria-label="Халона">
            <span>Дакъош:</span>
            {[9, 12, 15].map((size) => (
              <button className={difficulty === size ? "active" : ""} key={size} onClick={() => chooseDifficulty(size)}>{size}</button>
            ))}
          </div>
          <button
            className="mosaic-preview-button icon-label"
            disabled={previewUses >= 3}
            onClick={openPuzzlePreview}
            aria-haspopup="dialog"
          >
            <AppIcon name="eye" />
            {previewUses < 3 ? `Сурт хьажа · ${3 - previewUses}` : "Сурт хьажна"}
          </button>
          <div className="mosaic-workspace">
            <div
              ref={boardRef}
              className={`mosaic-board ${mosaicResult === "right" ? "checked-correct" : ""}`}
              style={{ gridTemplateColumns: `repeat(${puzzleColumns}, 1fr)` }}
            >
              {order.map((piece, position) => {
                const row = Math.floor(piece / puzzleColumns);
                const column = piece % puzzleColumns;
                const shape = puzzlePiecePath(piece, puzzleColumns);
                const clipId = `piece-clip-${difficulty}-${piece}-${position}`;
                const isDragging = dragging?.position === position;
                return (
                  <button
                    key={`${puzzle.image}-${difficulty}-${position}`}
                    className={isDragging ? "dragging" : ""}
                    aria-label={`${position + 1}-гӀа дакъа`}
                    disabled={mosaicResult === "right"}
                    onPointerDown={(event) => startPieceDrag(event, position)}
                    onPointerMove={movePieceDrag}
                    onPointerUp={finishPieceDrag}
                    onPointerCancel={() => { dragRef.current = null; setDragging(null); }}
                    style={{
                      transform: isDragging ? `translate3d(${dragging.x}px, ${dragging.y}px, 0) scale(1.06)` : undefined,
                      zIndex: isDragging ? 20 : undefined,
                    }}
                  >
                    <svg className="mosaic-piece" viewBox="-16 -16 132 132" preserveAspectRatio="none" aria-hidden="true">
                      <defs>
                        <clipPath id={clipId} clipPathUnits="userSpaceOnUse"><path d={shape} /></clipPath>
                      </defs>
                      <g clipPath={`url(#${clipId})`}>
                        <image
                          href={puzzle.image}
                          x={-column * 100}
                          y={-row * 100}
                          width={puzzleColumns * 100}
                          height="300"
                          preserveAspectRatio="none"
                        />
                      </g>
                      <path className="mosaic-piece-edge" d={shape} />
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>
          <p className={`mosaic-feedback ${mosaicResult}`}>
            {mosaicResult === "right" ? "Нийса! Сурт гулделла." : mosaicResult === "wrong" ? "Дакъош нийса дац — юха хьажа" : "Ши дакъа тӀетаӀайе — царна меттигаш хийца"}
          </p>
          <div className="mosaic-actions">
            {mosaicResult === "right" ? (
              <button className="game-main-button" onClick={() => choosePuzzle((puzzleIndex + 1) % theme.puzzles.length)}>Кхин сурт</button>
            ) : (
              <button className="game-main-button" onClick={() => setMosaicResult(solved ? "right" : "wrong")}>Таллам бе</button>
            )}
            <button className="shuffle-puzzle icon-label" onClick={() => { setOrder(makePuzzleOrder(difficulty)); setDragging(null); dragRef.current = null; setMosaicResult("idle"); }}>
              <AppIcon name="refresh" /> Юха кегаде
            </button>
          </div>
          {previewOpen && (
            <div className="mosaic-preview-dialog" role="dialog" aria-modal="true" aria-label={puzzle.title} onClick={() => setPreviewOpen(false)}>
              <div onClick={(event) => event.stopPropagation()}>
                <button className="mosaic-preview-close" onClick={() => setPreviewOpen(false)} aria-label="ДӀакъовла">
                  <AppIcon name="close" />
                </button>
                <img src={puzzle.image} alt={puzzle.title} />
                <strong>{puzzle.title}</strong>
                <small>{3 - previewUses} юха хьажа йиш ю</small>
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
