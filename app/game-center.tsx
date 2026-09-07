"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { LearningItem } from "./home-extras";
import AppIcon from "./ui-icon";
import { addAnswerTile, removeAnswerTile } from "./word-selection.mjs";
import { tapHaptic } from "./haptics.mjs";

type GameScreen = "hub" | "word" | "mosaic";
type Result = "idle" | "right" | "wrong";
type WordPhase = "menu" | "playing" | "summary";
type WordPlayMode = "untimed" | "timed";
type LetterTile = { id: string; value: string };
type WordOutcome = { key: string; correct: boolean };
type PieceSource = "tray" | "board";
type PieceDrag = { piece: number; source: PieceSource; position: number; startX: number; startY: number; clientX: number; clientY: number };
type PieceSelection = { piece: number; source: PieceSource; position: number };
type PuzzleState = { board: Array<number | null>; tray: number[] };

const mosaicThemes = [
  {
    id: "architecture",
    icon: "/icons/mosaic/architecture.png",
    title: "Нохчийн гӀишлош",
    note: "Башенаш, эвланаш, цӀенош",
    puzzles: [
      { title: "Ламанан гӀаланаш", image: "/games/mosaic/tower-complex.jpg" },
      { title: "Ламанан йурт", image: "/games/mosaic/mountain-village.jpg" },
      { title: "ТӀай а, гӀала а", image: "/games/mosaic/stone-bridge.jpg" },
    ],
  },
  {
    id: "fairytale-scenes",
    icon: "/icons/mosaic/fairytale-scenes.png",
    title: "Туьйран сурташ",
    note: "Дуьззина сйужетан сурташ",
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

function makeWordSession(items: LearningItem[], size = 10): number[] {
  const categoryIds = shuffled([...new Set(items.map((item) => item.categoryId))]);
  const groups = new Map(categoryIds.map((categoryId) => [
    categoryId,
    shuffled(items.map((item, index) => ({ item, index })).filter(({ item }) => item.categoryId === categoryId).map(({ index }) => index)),
  ]));
  const result: number[] = [];
  while (result.length < Math.min(size, items.length)) {
    let added = false;
    for (const categoryId of shuffled(categoryIds)) {
      const next = groups.get(categoryId)?.shift();
      if (next === undefined) continue;
      result.push(next);
      added = true;
      if (result.length === Math.min(size, items.length)) break;
    }
    if (!added) break;
  }
  return result;
}

function makePuzzleOrder(size = 9): number[] {
  const solved = Array.from({ length: size }, (_, index) => index);
  let next = shuffled(solved);
  if (next.every((value, index) => value === index)) next = [...next.slice(1), next[0]];
  return next;
}

function makePuzzleState(size: number, mode: "tray" | "swap"): PuzzleState {
  if (mode === "swap") {
    return { board: makePuzzleOrder(size), tray: [] };
  }
  return {
    board: Array.from({ length: size }, () => null),
    tray: makePuzzleOrder(size),
  };
}

function puzzleEdge(startX: number, startY: number, endX: number, endY: number, tab: number): string {
  if (!tab) return `L ${endX} ${endY}`;
  const directionX = (endX - startX) / 100;
  const directionY = (endY - startY) / 100;
  const normalX = directionY;
  const normalY = -directionX;
  const point = (along: number, outward = 0) => {
    const x = startX + directionX * along + normalX * outward * tab;
    const y = startY + directionY * along + normalY * outward * tab;
    return `${Number(x.toFixed(2))} ${Number(y.toFixed(2))}`;
  };
  return [
    `L ${point(42)}`,
    `L ${point(42, 4)}`,
    `C ${point(36, 6)} ${point(36, 15)} ${point(42, 18)}`,
    `C ${point(47, 22)} ${point(53, 22)} ${point(58, 18)}`,
    `C ${point(64, 15)} ${point(64, 6)} ${point(58, 4)}`,
    `L ${point(58)}`,
    `L ${endX} ${endY}`,
  ].join(" ");
}

function puzzlePiecePath(piece: number, columns: number, rows: number): string {
  const row = Math.floor(piece / columns);
  const column = piece % columns;
  const lastRow = rows - 1;
  const right = column === columns - 1 ? 0 : (row + column) % 2 === 0 ? 1 : -1;
  const bottom = row === lastRow ? 0 : (row * columns + column) % 2 === 0 ? 1 : -1;
  const top = row === 0 ? 0 : -(((row - 1) * columns + column) % 2 === 0 ? 1 : -1);
  const left = column === 0 ? 0 : -((row + column - 1) % 2 === 0 ? 1 : -1);
  return [
    "M 0 0",
    puzzleEdge(0, 0, 100, 0, top),
    puzzleEdge(100, 0, 100, 100, right),
    puzzleEdge(100, 100, 0, 100, bottom),
    puzzleEdge(0, 100, 0, 0, left),
    "Z",
  ].join(" ");
}

function PuzzleGraphic({ image, piece, columns, rows, clipId, slot = false }: {
  image: string;
  piece: number;
  columns: number;
  rows: number;
  clipId: string;
  slot?: boolean;
}) {
  const row = Math.floor(piece / columns);
  const column = piece % columns;
  const shape = puzzlePiecePath(piece, columns, rows);
  return (
    <svg className="mosaic-piece" viewBox="-16 -16 132 132" preserveAspectRatio="none" aria-hidden="true">
      {slot ? (
        <path className="mosaic-slot-edge" d={shape} />
      ) : (
        <>
          <defs>
            <clipPath id={clipId} clipPathUnits="userSpaceOnUse"><path d={shape} /></clipPath>
          </defs>
          <g clipPath={`url(#${clipId})`}>
            <image
              href={image}
              x={-column * 100}
              y={-row * 100}
              width={columns * 100}
              height={rows * 100}
              preserveAspectRatio="xMidYMid slice"
            />
          </g>
          <path className="mosaic-piece-edge" d={shape} />
        </>
      )}
    </svg>
  );
}

export default function GameCenter({ items, onBack, mosaicPieces, mosaicMode }: { items: LearningItem[]; onBack: () => void; mosaicPieces: 6 | 9 | 12 | 15; mosaicMode: "tray" | "swap" }) {
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
  const [wordPhase, setWordPhase] = useState<WordPhase>("menu");
  const [wordPlayMode, setWordPlayMode] = useState<WordPlayMode>("untimed");
  const [wordTimeLimit, setWordTimeLimit] = useState<15 | 30 | 45 | 60>(30);
  const [timeLeft, setTimeLeft] = useState(30);
  const [mistakes, setMistakes] = useState(0);
  const [wordSession, setWordSession] = useState<number[]>([]);
  const [wordPosition, setWordPosition] = useState(0);
  const [wordOutcomes, setWordOutcomes] = useState<WordOutcome[]>([]);
  const [failedWordKeys, setFailedWordKeys] = useState<string[]>([]);
  const advancingWordRef = useRef(false);
  const wordAdvanceTimerRef = useRef<number | null>(null);
  const [themeIndex, setThemeIndex] = useState<number | null>(null);
  const [puzzleIndex, setPuzzleIndex] = useState<number | null>(null);
  const difficulty = mosaicPieces;
  const [puzzleState, setPuzzleState] = useState<PuzzleState>(() => makePuzzleState(mosaicPieces, mosaicMode));
  const [dragging, setDragging] = useState<PieceDrag | null>(null);
  const dragRef = useRef<PieceDrag | null>(null);
  const [selectedPiece, setSelectedPiece] = useState<PieceSelection | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const [mosaicResult, setMosaicResult] = useState<Result>("idle");
  const [previewUses, setPreviewUses] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [phonePortrait, setPhonePortrait] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 760px) and (orientation: portrait)");
    const updateLayout = () => setPhonePortrait(media.matches);
    updateLayout();
    media.addEventListener("change", updateLayout);
    return () => media.removeEventListener("change", updateLayout);
  }, []);

  useEffect(() => {
    setPuzzleState(makePuzzleState(difficulty, mosaicMode));
    setSelectedPiece(null);
    setMosaicResult("idle");
  }, [difficulty, mosaicMode]);

  useEffect(() => {
    if (screen !== "word" || wordPhase !== "playing" || wordPlayMode !== "timed" || wordResult === "right" || advancingWordRef.current) return;
    if (timeLeft <= 0) {
      setWordResult("wrong");
      advancingWordRef.current = true;
      wordAdvanceTimerRef.current = window.setTimeout(() => {
        wordAdvanceTimerRef.current = null;
        finishCurrentWord(false);
      }, 700);
      return;
    }
    const timer = window.setTimeout(() => setTimeLeft((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [screen, wordPhase, wordPlayMode, wordResult, timeLeft]);

  useEffect(() => () => {
    if (wordAdvanceTimerRef.current !== null) window.clearTimeout(wordAdvanceTimerRef.current);
  }, []);

  const theme = themeIndex === null ? null : mosaicThemes[themeIndex];
  const puzzle = theme && puzzleIndex !== null ? theme.puzzles[puzzleIndex % theme.puzzles.length] : null;
  const solved = puzzleState.board.every((value, index) => value === index);
  const puzzleColumns = phonePortrait
    ? difficulty === 6 ? 2 : 3
    : difficulty === 6 ? 3 : difficulty / 3;
  const puzzleRows = difficulty / puzzleColumns;

  function returnOneLevel() {
    if (wordAdvanceTimerRef.current !== null) {
      window.clearTimeout(wordAdvanceTimerRef.current);
      wordAdvanceTimerRef.current = null;
      advancingWordRef.current = false;
    }
    if (screen === "hub") return onBack();
    if (screen === "mosaic" && themeIndex !== null && puzzleIndex !== null) {
      setPuzzleIndex(null);
      setDragging(null);
      dragRef.current = null;
      setSelectedPiece(null);
      setMosaicResult("idle");
      setPreviewOpen(false);
      return;
    }
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

  function openWordMenu() {
    setScreen("word");
    setWordPhase("menu");
  }

  function loadWord(nextIndex: number) {
    setWordIndex(nextIndex);
    setLetters(makeTiles(wordItems[nextIndex]?.word || "дош"));
    setChosen([]);
    setWordResult("idle");
    setMistakes(0);
    setTimeLeft(wordTimeLimit);
    advancingWordRef.current = false;
  }

  function startWordSession(reviewMistakes = false) {
    const session = reviewMistakes
      ? failedWordKeys.map((key) => wordItems.findIndex((item) => item.key === key)).filter((index) => index >= 0)
      : makeWordSession(wordItems, 10);
    if (!session.length) return;
    if (wordAdvanceTimerRef.current !== null) window.clearTimeout(wordAdvanceTimerRef.current);
    wordAdvanceTimerRef.current = null;
    setWordSession(session);
    setWordPosition(0);
    setWordOutcomes([]);
    setWordPhase("playing");
    loadWord(session[0]);
  }

  function finishCurrentWord(correct: boolean) {
    if (!wordItem || !wordSession.length) return;
    const outcomes = [...wordOutcomes, { key: wordItem.key, correct }];
    const nextPosition = wordPosition + 1;
    setWordOutcomes(outcomes);
    if (nextPosition >= wordSession.length) {
      setFailedWordKeys(outcomes.filter((outcome) => !outcome.correct).map((outcome) => outcome.key));
      setWordPhase("summary");
      advancingWordRef.current = false;
      return;
    }
    setWordPosition(nextPosition);
    loadWord(wordSession[nextPosition]);
  }

  function checkWord() {
    if (!wordItem) return;
    const answer = chosen.map((id) => letters.find((letter) => letter.id === id)?.value || "").join("");
    if (answer.toLocaleLowerCase() === wordItem.word.replace(/\s/g, "").toLocaleLowerCase()) {
      setWordResult("right");
      return;
    }
    const nextMistakes = mistakes + 1;
    setMistakes(nextMistakes);
    setWordResult("wrong");
    if (nextMistakes >= 5) {
      advancingWordRef.current = true;
      wordAdvanceTimerRef.current = window.setTimeout(() => {
        wordAdvanceTimerRef.current = null;
        finishCurrentWord(false);
      }, 700);
    }
  }

  function chooseTheme(index: number) {
    setThemeIndex(index);
    setPuzzleIndex(null);
    setPuzzleState(makePuzzleState(difficulty, mosaicMode));
    setSelectedPiece(null);
    setDragging(null);
    dragRef.current = null;
    setMosaicResult("idle");
    setPreviewUses(0);
    setPreviewOpen(false);
  }

  function choosePuzzle(index: number) {
    setPuzzleIndex(index);
    setPuzzleState(makePuzzleState(difficulty, mosaicMode));
    setSelectedPiece(null);
    setDragging(null);
    dragRef.current = null;
    setMosaicResult("idle");
    setPreviewUses(0);
    setPreviewOpen(false);
  }

  function resetPuzzle() {
    setPuzzleState(makePuzzleState(difficulty, mosaicMode));
    setSelectedPiece(null);
    setDragging(null);
    dragRef.current = null;
    setMosaicResult("idle");
  }

  function placePiece(origin: PieceSelection, target: number) {
    if (target < 0 || target >= difficulty) return;
    setPuzzleState((current) => {
      const board = [...current.board];
      let tray = [...current.tray];
      const displaced = board[target];

      if (origin.source === "tray") {
        tray = tray.filter((piece) => piece !== origin.piece);
      } else {
        if (origin.position === target) return current;
        board[origin.position] = null;
      }

      if (displaced !== null) {
        if (origin.source === "board") board[origin.position] = displaced;
        else tray.push(displaced);
      }
      board[target] = origin.piece;
      return { board, tray };
    });
    setSelectedPiece(null);
    setMosaicResult("idle");
  }

  function startPieceDrag(event: ReactPointerEvent<HTMLButtonElement>, piece: number, source: PieceSource, position: number) {
    if (mosaicResult === "right" || !event.isPrimary || event.button !== 0) return;
    const next: PieceDrag = {
      piece,
      source,
      position,
      startX: event.clientX,
      startY: event.clientY,
      clientX: event.clientX,
      clientY: event.clientY,
    };
    dragRef.current = next;
    setDragging(next);
    event.currentTarget.setPointerCapture(event.pointerId);
    tapHaptic();
  }

  function movePieceDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    const current = dragRef.current;
    if (!current) return;
    event.preventDefault();
    const next = {
      ...current,
      clientX: event.clientX,
      clientY: event.clientY,
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
    const row = Math.floor(((event.clientY - bounds.top) / bounds.height) * puzzleRows);
    if (column < 0 || column >= puzzleColumns || row < 0 || row >= puzzleRows) return;
    const target = row * puzzleColumns + column;
    placePiece(current, target);
  }

  function openPuzzlePreview() {
    if (previewUses >= 3) return;
    setPreviewUses((current) => current + 1);
    setPreviewOpen(true);
  }

  return (
    <main className={`extra-shell games-shell extra-theme-games games-screen-${screen}`}>
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
            <button className="game-choice word-choice" onClick={openWordMenu}>
              <span className="game-choice-art">
                <img src="/icons/games/word-builder.png" alt="" draggable={false} />
              </span>
              <strong>Дош гулде</strong>
            </button>
            <button className="game-choice mosaic-choice" onClick={() => setScreen("mosaic")}>
              <span className="game-choice-art" aria-hidden="true">
                <img src="/icons/games/mosaic.png" alt="" draggable={false} />
              </span>
              <strong>Мозаика</strong>
            </button>
          </div>
        </section>
      )}

      {screen === "word" && wordPhase === "menu" && (
        <section className="word-builder word-start">
          <small>ДОШ ГУЛДАР</small>
          <h1>Дош гулде</h1>
          <div className="word-start-card">
            <img src="/icons/games/word-builder.png" alt="" draggable={false} />
            <div className="word-mode-options" role="group" aria-label="Ловзаран кеп">
              <button className={wordPlayMode === "untimed" ? "active" : ""} onClick={() => setWordPlayMode("untimed")}>
                <strong>Хенах доцуш</strong>
                <small>Сиха хила ца деза</small>
              </button>
              <button className={wordPlayMode === "timed" ? "active" : ""} onClick={() => setWordPlayMode("timed")}>
                <strong>Хенца</strong>
                <small>ХӀора дешна таймер</small>
              </button>
            </div>
            {wordPlayMode === "timed" && (
              <div className="word-time-options" role="group" aria-label="Хан харжа">
                {[15, 30, 45, 60].map((seconds) => (
                  <button key={seconds} className={wordTimeLimit === seconds ? "active" : ""} onClick={() => setWordTimeLimit(seconds as 15 | 30 | 45 | 60)}>{seconds} сек.</button>
                ))}
              </div>
            )}
            <div className="word-start-rules"><span><b>10</b> дош</span><span><b>5</b> гӀалат</span></div>
            <button className="game-main-button" disabled={!wordItems.length} onClick={() => startWordSession(false)}>Ловза</button>
          </div>
        </section>
      )}

      {screen === "word" && wordPhase === "playing" && wordItem && (
        <section className="word-builder">
          <small>ДОШ ГУЛДАР</small>
          <h1>Дош гулде</h1>
          <div className="word-session-status">
            <span><b>{wordPosition + 1}</b> / {wordSession.length}</span>
            <span className={mistakes >= 4 ? "danger" : ""}>{5 - mistakes} гӀалат</span>
            {wordPlayMode === "timed" && <time className={timeLeft <= 5 ? "danger" : ""}>{timeLeft} сек.</time>}
          </div>
          <div className="builder-card">
            <img src={wordItem.image} alt="" draggable={false} />
            <div className="answer-slots" aria-label="Жоп">
              {[...wordItem.word.replace(/\s/g, "")].map((_, index) => {
                const tile = letters.find((letter) => letter.id === chosen[index]);
                return <button key={tile?.id || `empty-${index}`} disabled={!tile || wordResult === "right" || advancingWordRef.current} onClick={() => { tapHaptic(); setChosen((current) => removeAnswerTile(current, tile?.id)); setWordResult("idle"); }}>{tile?.value.toUpperCase() || ""}</button>;
              })}
            </div>
            <div className="letter-bank">
              {letters.map((letter) => (
                <button
                  key={letter.id}
                  disabled={chosen.includes(letter.id) || wordResult === "right" || advancingWordRef.current}
                  onClick={() => { tapHaptic(); setChosen((current) => addAnswerTile(current, letter.id)); if (mistakes < 5) setWordResult("idle"); }}
                >{letter.value.toUpperCase()}</button>
              ))}
            </div>
            <p className={`builder-feedback ${wordResult}`}>
              {wordResult === "right" ? `Нийса! ${wordItem.word}` : wordResult === "wrong" && advancingWordRef.current ? `Жоп: ${wordItem.word}` : wordResult === "wrong" ? `Йуха хьажа · ${5 - mistakes} гӀалат` : null}
            </p>
            {wordResult === "right" ? (
              <button className="game-main-button" onClick={() => finishCurrentWord(true)}>{wordPosition + 1 >= wordSession.length ? "ЖамӀаш" : "Кхин дош"}</button>
            ) : (
              <button className="game-main-button" disabled={chosen.length !== letters.length || chosen.some((id) => !id) || mistakes >= 5 || advancingWordRef.current} onClick={checkWord}>Таллам бе</button>
            )}
          </div>
        </section>
      )}

      {screen === "word" && wordPhase === "summary" && (
        <section className="word-builder word-summary">
          <small>ЛОВЗАР ЧЕКХДАЬЛЛА</small>
          <h1>ЖамӀаш</h1>
          <div className="word-summary-card">
            <img src="/icons/games/word-builder.png" alt="" draggable={false} />
            <div className="word-summary-score">
              <span className="right"><b>{wordOutcomes.filter((outcome) => outcome.correct).length}</b><small>нийса</small></span>
              <span className="wrong"><b>{wordOutcomes.filter((outcome) => !outcome.correct).length}</b><small>нийса дац</small></span>
            </div>
            <button className="game-main-button" onClick={() => startWordSession(false)}>Йуха ловза</button>
            {failedWordKeys.length > 0 && <button className="review-word-button" onClick={() => startWordSession(true)}>ГӀалаташ йуха Ӏамо</button>}
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
                <img className="mosaic-theme-icon" src={item.icon} alt="" draggable={false} />
                <span><strong>{item.title}</strong><small>{item.note}</small></span>
              </button>
            ))}
          </div>
        </section>
      )}

      {screen === "mosaic" && theme && puzzleIndex === null && (
        <section className="mosaic-themes mosaic-puzzles">
          <small>МОЗАИКА · {theme.title}</small>
          <h1>Сурт харжа</h1>
          <div>
            {theme.puzzles.map((item, index) => (
              <button key={item.title} onClick={() => choosePuzzle(index)}>
                <img src={item.image} alt="" />
                <span><strong>{item.title}</strong></span>
              </button>
            ))}
          </div>
        </section>
      )}

      {screen === "mosaic" && theme && puzzle && (
        <section className="mosaic-game">
          <small>МОЗАИКА · {theme.title}</small>
          <h1>{puzzle.title}</h1>
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
              className={`mosaic-board ${phonePortrait ? "phone-portrait" : "wide-layout"} ${mosaicResult === "right" ? "checked-correct" : ""}`}
              style={{
                gridTemplateColumns: `repeat(${puzzleColumns}, 1fr)`,
                gridTemplateRows: `repeat(${puzzleRows}, 1fr)`,
                aspectRatio: `${puzzleColumns} / ${puzzleRows}`,
              }}
            >
              {puzzleState.board.map((piece, position) => {
                const isDragging = dragging?.source === "board" && dragging.position === position;
                const isSelected = selectedPiece?.source === "board" && selectedPiece.position === position;
                return (
                  <button
                    key={`${puzzle.image}-${difficulty}-${position}`}
                    className={`mosaic-slot ${piece === null ? "empty" : "filled"} ${isDragging ? "dragging-source" : ""} ${isSelected ? "selected-piece" : ""}`}
                    aria-label={`${position + 1}-гӀа дакъа`}
                    disabled={mosaicResult === "right"}
                    onClick={() => {
                      if (selectedPiece) placePiece(selectedPiece, position);
                      else if (piece !== null) setSelectedPiece({ piece, source: "board", position });
                    }}
                    onPointerDown={piece === null ? undefined : (event) => startPieceDrag(event, piece, "board", position)}
                    onPointerMove={movePieceDrag}
                    onPointerUp={finishPieceDrag}
                    onPointerCancel={() => { dragRef.current = null; setDragging(null); }}
                  >
                    {piece === null ? (
                      <PuzzleGraphic image={puzzle.image} piece={position} columns={puzzleColumns} rows={puzzleRows} clipId={`slot-${difficulty}-${position}`} slot />
                    ) : (
                      <PuzzleGraphic image={puzzle.image} piece={piece} columns={puzzleColumns} rows={puzzleRows} clipId={`board-${difficulty}-${position}-${piece}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          {mosaicMode === "tray" && (
            <div className="mosaic-tray">
              <div className="mosaic-tray-heading">
                <strong>Суьртан дакъош</strong>
                <span>{puzzleState.tray.length}</span>
              </div>
              <div className="mosaic-piece-carousel" aria-label="Суьртан дакъош">
                {puzzleState.tray.map((piece, position) => {
                  const isDragging = dragging?.source === "tray" && dragging.piece === piece;
                  const isSelected = selectedPiece?.source === "tray" && selectedPiece.piece === piece;
                  return (
                    <button
                      key={`${puzzle.image}-tray-${difficulty}-${piece}`}
                      className={`${isDragging ? "dragging-source" : ""} ${isSelected ? "selected-piece" : ""}`}
                      aria-label={`${piece + 1}-гӀа дакъа`}
                      disabled={mosaicResult === "right"}
                      onClick={() => setSelectedPiece({ piece, source: "tray", position })}
                      onPointerDown={(event) => startPieceDrag(event, piece, "tray", position)}
                      onPointerMove={movePieceDrag}
                      onPointerUp={finishPieceDrag}
                      onPointerCancel={() => { dragRef.current = null; setDragging(null); }}
                    >
                      <PuzzleGraphic image={puzzle.image} piece={piece} columns={puzzleColumns} rows={puzzleRows} clipId={`tray-${difficulty}-${piece}`} />
                    </button>
                  );
                })}
                {puzzleState.tray.length === 0 && <p>Массо дакъа хӀоттийна</p>}
              </div>
            </div>
          )}
          <p className={`mosaic-feedback ${mosaicResult}`}>
            {mosaicResult === "right" ? "Нийса! Сурт гулделла." : mosaicResult === "wrong" ? "Дакъош нийса дац — йуха хьажа" : null}
          </p>
          <div className="mosaic-actions">
            {mosaicResult === "right" ? (
              <button className="game-main-button" onClick={() => choosePuzzle(((puzzleIndex ?? 0) + 1) % theme.puzzles.length)}>Кхин сурт</button>
            ) : (
              <button className="game-main-button" disabled={puzzleState.tray.length > 0} onClick={() => setMosaicResult(solved ? "right" : "wrong")}>Таллам бе</button>
            )}
            <button className="shuffle-puzzle icon-label" onClick={resetPuzzle}>
              <AppIcon name="refresh" /> Йуха кегаде
            </button>
          </div>
          {dragging && (
            <div className="mosaic-drag-ghost" style={{ left: dragging.clientX, top: dragging.clientY }} aria-hidden="true">
              <PuzzleGraphic image={puzzle.image} piece={dragging.piece} columns={puzzleColumns} rows={puzzleRows} clipId={`drag-${difficulty}-${dragging.piece}`} />
            </div>
          )}
          {previewOpen && (
            <div className="mosaic-preview-dialog" role="dialog" aria-modal="true" aria-label={puzzle.title} onClick={() => setPreviewOpen(false)}>
              <div onClick={(event) => event.stopPropagation()}>
                <button className="mosaic-preview-close" onClick={() => setPreviewOpen(false)} aria-label="ДӀакъовла">
                  <AppIcon name="close" />
                </button>
                <img src={puzzle.image} alt={puzzle.title} />
                <strong>{puzzle.title}</strong>
                <small>{3 - previewUses} йуха хьажа йиш йу</small>
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
