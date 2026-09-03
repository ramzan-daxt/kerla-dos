"use client";

import { useMemo, useState } from "react";
import type { LearningItem } from "./home-extras";
import AppIcon from "./ui-icon";

type GameScreen = "hub" | "word" | "mosaic";
type Result = "idle" | "right" | "wrong";
type LetterTile = { id: string; value: string };

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
    id: "nature",
    title: "Ӏалам",
    note: "Лам, хи, малх",
    puzzles: [
      { title: "Лам", image: "/illustrations/alphabet/mountain.png" },
      { title: "Хи", image: "/illustrations/alphabet/water.png" },
      { title: "Малх", image: "/illustrations/alphabet/sun.png" },
    ],
  },
  {
    id: "animals",
    title: "Дийнаташ",
    note: "Борз, говр, аьрзу",
    puzzles: [
      { title: "Борз", image: "/illustrations/animals/wolf.png" },
      { title: "Говр", image: "/illustrations/animals/horse.png" },
      { title: "Аьрзу", image: "/illustrations/alphabet/eagle.png" },
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
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
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
      setSelectedPiece(null);
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
    setSelectedPiece(null);
    setMosaicResult("idle");
    setPreviewUses(0);
    setPreviewOpen(false);
  }

  function choosePuzzle(index: number) {
    setPuzzleIndex(index);
    setOrder(makePuzzleOrder(difficulty));
    setSelectedPiece(null);
    setMosaicResult("idle");
    setPreviewUses(0);
    setPreviewOpen(false);
  }

  function movePiece(position: number) {
    if (mosaicResult === "right") return;
    if (selectedPiece === null) {
      setSelectedPiece(position);
      return;
    }
    if (selectedPiece === position) {
      setSelectedPiece(null);
      return;
    }
    setOrder((current) => {
      const next = [...current];
      [next[selectedPiece], next[position]] = [next[position], next[selectedPiece]];
      return next;
    });
    setSelectedPiece(null);
    setMosaicResult("idle");
  }

  function chooseDifficulty(size: number) {
    setDifficulty(size);
    setOrder(makePuzzleOrder(size));
    setSelectedPiece(null);
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
              className={`mosaic-board ${mosaicResult === "right" ? "checked-correct" : ""}`}
              style={{ gridTemplateColumns: `repeat(${puzzleColumns}, 1fr)` }}
            >
              {order.map((piece, position) => {
                const row = Math.floor(piece / puzzleColumns);
                const column = piece % puzzleColumns;
                return (
                  <button
                    key={`${puzzle.image}-${difficulty}-${position}`}
                    className={selectedPiece === position ? "selected" : ""}
                    aria-label={`${position + 1}-гӀа дакъа`}
                    disabled={mosaicResult === "right"}
                    onClick={() => movePiece(position)}
                    style={{
                      backgroundImage: `url(${puzzle.image})`,
                      backgroundSize: `${puzzleColumns * 100}% 300%`,
                      backgroundPosition: `${(column / (puzzleColumns - 1)) * 100}% ${row * 50}%`,
                    }}
                  />
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
            <button className="shuffle-puzzle icon-label" onClick={() => { setOrder(makePuzzleOrder(difficulty)); setSelectedPiece(null); setMosaicResult("idle"); }}>
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
