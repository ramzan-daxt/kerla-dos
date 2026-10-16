"use client";
import { useEffect, useRef, useState } from "react";
import SettingsPanel, { type Settings } from "./settings";
import ScriptText, { latinize } from "./script-text";
import { getWordTranslation } from "./word-translations";
import HomeExtras, { type LearningItem } from "./home-extras";
import AppIcon from "./ui-icon";
import WordLabel from "./word-label";
import { audioTapFeedback } from "./audio-tap-feedback";
import { favoriteFeedback } from "./favorite-feedback";
import { createAudioPool } from "./audio-pool.mjs";
import LessonActions from "./lesson-actions";
import CategoryPattern from "./category-pattern";
import { normalizeChechen, cardWord } from "./chechen-orthography.mjs";
import type { Word, Category } from "./types";
import { categories, alphabetCategory, categoryIcons, freeCategoryIds } from "./data/vocabulary";
import Modal from "./components/modal";
import AlphabetWord from "./components/alphabet-word";
import { useLearningProgress } from "./hooks/use-learning-progress";
import { quizOptions } from "./lib/quiz-options.mjs";

export default function Home() {
  const { progress, update } = useLearningProgress();
  const { stars, premium, settings, favorites, lastLesson, learnedWords } = progress;
  const [active, setActive] = useState<Category | null>(null),
    [mode, setMode] = useState<"learn" | "game">("learn"),
    [alphabetOverview, setAlphabetOverview] = useState(false),
    [index, setIndex] = useState(0),
    [round, setRound] = useState(0),
    [answer, setAnswer] = useState<"idle" | "right" | "wrong">("idle"),
    [selected, setSelected] = useState<Word | null>(null),
    [paywall, setPaywall] = useState(false),
    [muted, setMuted] = useState(false),
    [settingsOpen, setSettingsOpen] = useState(false),
    [homeView, setHomeView] = useState<
      "categories" | "random" | "favorites" | "stories" | "games" | null
    >(null),
    [cardMotion, setCardMotion] = useState<
      "idle" | "out-left" | "out-right" | "in-left" | "in-right"
    >("idle"),
    [cardDrag, setCardDrag] = useState(0),
    [cardExitOrigin, setCardExitOrigin] = useState(0),
    [cardDragging, setCardDragging] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const audioPool = useRef(createAudioPool());
  const swipeStart = useRef<{
    x: number;
    y: number;
    pointerId: number;
  } | null>(null);
  const swipeHandled = useRef(false);
  const motionLocked = useRef(false);
  const motionPhase = useRef<"idle" | "out" | "in">("idle");
  const motionDirection = useRef<-1 | 1>(1);
  const indexRef = useRef(0);
  const cardTimers = useRef<number[]>([]);
  const audioRequest = useRef(0);
  const skipNextAutoSpeak = useRef(false);
  useEffect(() => {
    document.body.classList.toggle("premium-open", premium);
    document.body.classList.toggle("large-text", settings.largeText);
    document.body.classList.toggle("reduce-motion", settings.reduceMotion);
  }, [premium, settings]);
  useEffect(() => {
    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    resetScroll();
    const frame = window.requestAnimationFrame(resetScroll);
    const timer = window.setTimeout(resetScroll, 80);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [active?.id, homeView]);
  const available =
    active && (premium || freeCategoryIds.has(active.id)) ? active.words : [];
  const target = available[round % (available.length || 1)];
  const options = quizOptions(available, target?.id, settings.difficulty, round);
  const tx = (s: string) => normalizeChechen(s);
  function saveSettings(v: Settings) {
    update("settings", v);
  }
  function stopAudio() {
    audioRequest.current += 1;
    audio.current?.pause();
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  }
  function playAudio(src: string, text: string) {
    const request = ++audioRequest.current;
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    audio.current?.pause();
    const clip = audioPool.current.get(src);
    clip.pause();
    clip.currentTime = 0;
    clip.volume = settings.volume;
    audio.current = clip;
    clip.play().catch(() => {
      if (audioRequest.current !== request || !("speechSynthesis" in window))
        return;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ru-RU";
      u.rate = settings.rate;
      u.volume = settings.volume;
      speechSynthesis.speak(u);
      if (settings.repeat)
        u.onend = () => {
          if (audioRequest.current !== request) return;
          const again = new SpeechSynthesisUtterance(text);
          again.lang = "ru-RU";
          again.rate = settings.rate;
          again.volume = settings.volume;
          speechSynthesis.speak(again);
        };
    });
  }
  function speak(w: Word, category: Category | null = active) {
    if (muted || !category) return;
    playAudio(
      w.audioSrc || `/audio/${category.id}/${w.id}.wav`,
      w.example ? `${w.chechen}. ${w.example}` : w.chechen,
    );
  }
  function speakAlphabetPart(w: Word, part: "letter" | "word") {
    if (muted) return;
    const text =
      part === "letter" ? w.chechen.split(" ")[0] : w.example || w.chechen;
    playAudio(
      part === "word" && w.audioSrc
        ? w.audioSrc
        : `/audio/alphabet/${w.id}-${part}.mp3`,
      text,
    );
  }
  function open(cat: Category, resumeAt?: number) {
    stopAudio();
    setAlphabetOverview(false);
    const startIndex =
      resumeAt !== undefined
        ? Math.min(Math.max(resumeAt, 0), cat.words.length - 1)
        : 0;
    clearCardTimers();
    motionLocked.current = false;
    motionPhase.current = "idle";
    indexRef.current = startIndex;
    setCardMotion("idle");
    setCardDrag(0);
    setCardExitOrigin(0);
    setCardDragging(false);
    setHomeView(null);
    setActive(cat);
    setMode("learn");
    setIndex(startIndex);
    setRound(0);
    setAnswer("idle");
    setSelected(null);
    if (
      settings.autoSpeak &&
      (premium || freeCategoryIds.has(cat.id)) &&
      cat.words[startIndex]
    ) {
      skipNextAutoSpeak.current = true;
      if (cat.id === "alphabet") {
        speakAlphabetPart(cat.words[startIndex], "letter");
      } else {
        speak(cat.words[startIndex], cat);
      }
    }
  }
  function clearCardTimers() {
    cardTimers.current.forEach((timer) => window.clearTimeout(timer));
    cardTimers.current = [];
  }
  function closeLesson(toCategories = false) {
    stopAudio();
    clearCardTimers();
    motionLocked.current = false;
    motionPhase.current = "idle";
    swipeStart.current = null;
    setCardMotion("idle");
    setCardDrag(0);
    setCardExitOrigin(0);
    setCardDragging(false);
    setActive(null);
    setHomeView(toCategories ? "categories" : null);
  }
  function finishCardEnter() {
    if (!active || motionPhase.current !== "in") return;
    clearCardTimers();
    motionPhase.current = "idle";
    setCardMotion("idle");
    setCardExitOrigin(0);
    motionLocked.current = false;
    if (settings.autoSpeak) {
      const nextWord = active.words[indexRef.current];
      if (active.id === "alphabet") {
        speakAlphabetPart(nextWord, "letter");
      } else {
        speak(nextWord);
      }
    }
  }
  function finishCardExit() {
    if (!active || motionPhase.current !== "out") return;
    clearCardTimers();
    const direction = motionDirection.current;
    const nextIndex =
      direction > 0
        ? (indexRef.current + 1) % active.words.length
        : indexRef.current === 0
          ? active.words.length - 1
          : indexRef.current - 1;
    indexRef.current = nextIndex;
    setIndex(nextIndex);
    motionPhase.current = "in";
    setCardMotion(direction > 0 ? "in-right" : "in-left");
    cardTimers.current.push(window.setTimeout(finishCardEnter, 500));
  }
  function moveCard(direction: -1 | 1) {
    if (!active || motionLocked.current) return;
    stopAudio();
    clearCardTimers();
    if (
      settings.reduceMotion ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const nextIndex =
        direction > 0
          ? (indexRef.current + 1) % active.words.length
          : indexRef.current === 0
            ? active.words.length - 1
            : indexRef.current - 1;
      indexRef.current = nextIndex;
      setIndex(nextIndex);
      setCardDrag(0);
      setCardExitOrigin(0);
      return;
    }
    motionLocked.current = true;
    motionPhase.current = "out";
    motionDirection.current = direction;
    setCardMotion(direction > 0 ? "out-left" : "out-right");
    cardTimers.current.push(window.setTimeout(finishCardExit, 500));
  }
  function choose(w: Word) {
    if (answer !== "right") {
      setSelected(w);
      setAnswer("idle");
    }
  }
  function gameTone(ok: boolean) {
    if (!settings.gameSounds) return;
    try {
      const Ctx = window.AudioContext,
        ctx = new Ctx(),
        osc = ctx.createOscillator(),
        gain = ctx.createGain();
      osc.frequency.value = ok ? 660 : 220;
      gain.gain.value = 0.06;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.stop(ctx.currentTime + 0.23);
    } catch {
      // Audio feedback is optional on browsers without AudioContext support.
    }
  }
  function check() {
    if (!selected || !target) return;
    if (selected.id === target.id) {
      setAnswer("right");
      gameTone(true);
      speak(target);
      if (active && active.id !== "alphabet" && active.id !== "numbers") {
        const key = `${active.id}:${target.id}`;
        update("learnedWords", (current) => {
          if (current.includes(key)) return current;
          const next = [...current, key];
          return next;
        });
      }
      const n = stars + 1;
      update("stars", n);
    } else {
      setAnswer("wrong");
      gameTone(false);
    }
  }
  function next() {
    setRound((r) => r + 1);
    setSelected(null);
    setAnswer("idle");
  }
  function unlock() {
    update("premium", true);
    setPaywall(false);
  }
  useEffect(() => {
    if (skipNextAutoSpeak.current) {
      skipNextAutoSpeak.current = false;
      return;
    }
    if (settings.autoSpeak && active && !motionLocked.current) {
      const word = active.words[index];
      if (active.id === "alphabet") {
        speakAlphabetPart(word, "letter");
      } else {
        speak(word);
      }
    }
  }, [active?.id, index, settings.autoSpeak]);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);
  useEffect(() => {
    if (!active) { audioPool.current.clear(); return; }
    const sources = [-1, 0, 1].map(offset => {
      const word = active.words[(index + offset + active.words.length) % active.words.length];
      return active.id === "alphabet" ? `/audio/alphabet/${word.id}-letter.mp3` : word.audioSrc || `/audio/${active.id}/${word.id}.wav`;
    });
    audioPool.current.prepare(sources);
  }, [active?.id, index]);
  useEffect(() => {
    if (!active) return;
    const position = { categoryId: active.id, index };
    update("lastLesson", position);
  }, [active, index, update]);
  useEffect(() => {
    function handleCardKeys(event: KeyboardEvent) {
      if (!active || mode !== "learn" || alphabetOverview) return;
      if (event.key === "ArrowLeft") moveCard(-1);
      if (event.key === "ArrowRight") moveCard(1);
    }
    window.addEventListener("keydown", handleCardKeys);
    return () => window.removeEventListener("keydown", handleCardKeys);
  }, [active?.id, mode, alphabetOverview]);
  useEffect(
    () => () => {
      stopAudio();
      audioPool.current.clear();
      cardTimers.current.forEach((timer) => window.clearTimeout(timer));
      cardTimers.current = [];
    },
    [],
  );
  const availableItems: LearningItem[] = categories
    .filter(
      (c) =>
        (premium || freeCategoryIds.has(c.id)),
    )
    .flatMap((c) =>
      c.words.map((w) => ({
        key: `${c.id}:${w.id}`,
        word: tx(w.chechen),
        visual: w.visual,
        categoryId: c.id,
        category: tx(c.title),
        color: w.color,
        image: w.image,
        audioSrc: w.audioSrc,
        classMarker: w.classMarker,
      })),
    );
  const learningItems = availableItems.filter(item => item.categoryId !== "alphabet" && item.categoryId !== "numbers");
  const visibleFavorites = availableItems.filter(item => favorites.includes(item.key)).map(item => item.key);
  function toggleFavorite(key: string) {
    update("favorites", (current) => {
      const next = current.includes(key)
        ? current.filter((x) => x !== key)
        : [...current, key];
      return next;
    });
  }
  const resumeCategory =
    categories.find((category) => category.id === lastLesson?.categoryId) ||
    alphabetCategory;
  const resumeIndex = Math.min(
    lastLesson?.index || 0,
    resumeCategory.words.length - 1,
  );
  if (homeView === "categories")
    return (
      <ScriptText latin={false}>
        <main className="category-library category-library-theme">
          <header>
            <button
              className="back icon-label" aria-label="Хьалха"
              onClick={() => setHomeView(null)}
            >
              <AppIcon name="arrow-left" /> <span>Коьртачу агӀор</span>
            </button>
            <button type="button" className="brand" onClick={() => setHomeView(null)}>
              KERLA <i>DOŞ</i>
            </button>
            <div className="stars icon-label">
              {stars} <AppIcon name="star" />
            </div>
          </header>
          <section className="category-library-head">
            <h1>ДЕШНИЙН ТОБАНАШ</h1>
          </section>
          <section className="category-library-grid">
            {categories
              .filter((cat) => cat.id !== "alphabet" && cat.id !== "numbers")
              .map((cat) => (
                <button
                  className={
                    `category-tile category-theme-${cat.id} ` +
                    (!freeCategoryIds.has(cat.id) && !premium
                      ? "paid-topic"
                      : "")
                  }
                  key={cat.id}
                  style={{ "--card": cat.accent } as React.CSSProperties}
                  onClick={() => open(cat)}
                >
                  <span className="category-tile-art">
                    <img
                      src={cat.id === "food" ? categoryIcons.food : `/icons/categories/cards/${cat.id}.png`}
                      alt=""
                      draggable={false}
                    />
                    {!freeCategoryIds.has(cat.id) && !premium && (
                      <i>
                        <AppIcon name="lock" />
                      </i>
                    )}
                  </span>
                  <span className="category-tile-copy">
                    <strong>{tx(cat.title)}</strong>
                    <small>{cat.words.length} дош</small>
                  </span>
                </button>
              ))}
          </section>
        </main>
      </ScriptText>
    );
  if (homeView)
    return (
      <HomeExtras
        view={homeView}
        items={homeView === "favorites" ? availableItems : learningItems}
        favorites={visibleFavorites}
        onFavorite={toggleFavorite}
        onBack={() => setHomeView(null)}
        rate={settings.rate}
        volume={settings.volume}
        latin={false}
        premium={premium}
        mosaicPieces={settings.mosaicPieces}
        mosaicMode={settings.mosaicMode}
      />
    );
  if (active && !freeCategoryIds.has(active.id) && !premium) {
    return (
      <ScriptText latin={false}>
        <main className={`app-shell category-gate learning-shell category-theme-${active.id}`}>
          <CategoryPattern icon={categoryIcons[active.id]} />
          <header>
            <button className="back icon-label" aria-label="Хьалха" onClick={() => closeLesson(true)}>
              <AppIcon name="arrow-left" /> <span>Дешнийн тобанаш</span>
            </button>
            <button type="button" className="brand" onClick={() => closeLesson(false)}>
              KERLA <i>DOŞ</i>
            </button>
            <div className="stars icon-label">
              {stars} <AppIcon name="star" />
            </div>
          </header>
          <section className="locked-topic universal-paywall">
            <div className="locked-topic-icon">
              <AppIcon name="lock" />
              <i>
                <AppIcon name="sparkle" />
              </i>
            </div>
            <small>KERLA DOŞ</small>
            <h1>Массо категореш дӀайоьлла</h1>
            <p>
              ДӀаэцар дича, кху а, кхечу а категорешкахь долу массо дешнаш
              дӀайоьллу.
            </p>
            <strong>2,99 €</strong>
            <span>Цкъа бен мах ца бо · массо приложенин таронаш</span>
            <button className="buy-button" onClick={unlock}>
              Приложени дӀаэца
            </button>
          </section>
        </main>
      </ScriptText>
    );
  }
  if (active) {
    const current = active.words[index];
    const letterForms = tx(current.chechen).split(" ");
    return (
      <ScriptText latin={false}>
        <main className={`app-shell learning-shell category-theme-${active.id}`}>
          <CategoryPattern icon={categoryIcons[active.id]} />
          <header>
            <button
              className="back icon-label" aria-label="Хьалха"
              onClick={() =>
                closeLesson(active.id !== "alphabet" && active.id !== "numbers")
              }
            >
              <AppIcon name="arrow-left" />
              <span>
                {active.id !== "alphabet" && active.id !== "numbers"
                  ? "Дешнийн тобанаш"
                  : "Коьртачу агӀор"}
              </span>
            </button>
            <button type="button" className="brand" onClick={() => closeLesson(false)}>
              KERLA <i>DOŞ</i>
            </button>
            <button
              className="sound"
              onClick={() => {
                if (!muted) stopAudio();
                setMuted(!muted);
              }}
              aria-label={muted ? "Аз дӀайолайайта" : "Аз дӀайаккха"}
            >
              <AppIcon name={muted ? "mute" : "sound"} />
            </button>
          </header>
          <section
            className="lesson-head"
            style={{ "--accent": active.accent } as React.CSSProperties}
          >
            <div className="topic-icon">
              <img src={active.icon} alt="" draggable={false} />
            </div>
            <div>
              <h1>{tx(active.title)}</h1>
              <small>{active.words.length} дош</small>
            </div>
            <div className="stars icon-label">
              {stars} <AppIcon name="star" />
            </div>
          </section>
          <nav className="modes">
            <button
              className={mode === "learn" ? "active" : ""}
              onClick={() => setMode("learn")}
            >
              <span className="icon-label">
                <AppIcon name="book" /> Ӏамо
              </span>
            </button>
            <button
              className={mode === "game" ? "active" : ""}
              onClick={() => {
                stopAudio();
                setMode("game");
                setAnswer("idle");
                setSelected(null);
              }}
            >
              <span className="icon-label">
                <AppIcon name="target" /> Ловза
              </span>
            </button>
          </nav>
          {active.id === "alphabet" && mode === "learn" && (
            <div className="alphabet-overview-controls">
              <button type="button" aria-label="Абат" aria-expanded={alphabetOverview} aria-controls="alphabet-content" onClick={() => { stopAudio(); clearCardTimers(); motionLocked.current = false; motionPhase.current = "idle"; setCardMotion("idle"); setCardDrag(0); setAlphabetOverview(!alphabetOverview); }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>
                Абат
              </button>
            </div>
          )}
          {mode === "learn" && active.id === "alphabet" && alphabetOverview ? (
            <section id="alphabet-content" className="alphabet-overview" aria-label="Абат">
              {active.words.map((word, letterIndex) => {
                const forms = tx(word.chechen).split(" ");
                return <button type="button" key={word.id} aria-label={word.chechen} aria-current={letterIndex === index ? "true" : undefined} onClick={() => { open(active, letterIndex); window.scrollTo({ top: 0, behavior: "instant" }); }}><strong>{forms[0]}</strong><span>{forms[1] || forms[0].toLowerCase()}</span></button>;
              })}
            </section>
          ) : mode === "learn" ? (
            <section id="alphabet-content" className="learn-area">
              <div
                className={`card-stage ${active.id === "alphabet" ? "alphabet-stage" : ""}`}
              >
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- The nested sound button provides the same action by keyboard. */}
                <div
                  key={`${active.id}:${current.id}:${cardMotion.startsWith("in-") ? "incoming" : "current"}`}
                  className={`big-card ${active.id === "alphabet" ? "alphabet-card" : ""} card-motion-${cardMotion}${cardDragging ? " card-dragging" : ""}`}
                  style={
                    {
                      "--accent": active.accent,
                      "--card-exit-origin": `${cardExitOrigin}px`,
                      ...(cardMotion === "idle" && cardDrag !== 0
                        ? {
                            transform: `translateX(${cardDrag}px) rotate(${cardDrag / 90}deg)`,
                            opacity: Math.max(.82, 1 - Math.abs(cardDrag) / 700),
                          }
                        : {}),
                    } as React.CSSProperties
                  }
                  onPointerDown={(event) => {
                    if (!event.isPrimary || motionLocked.current) return;
                    // Buttons must retain their pointer/click target instead of
                    // being captured by the card's swipe gesture.
                    if ((event.target as Element).closest("button")) return;
                    swipeStart.current = {
                      x: event.clientX,
                      y: event.clientY,
                      pointerId: event.pointerId,
                    };
                    swipeHandled.current = false;
                    setCardExitOrigin(0);
                    setCardDragging(true);
                    event.currentTarget.setPointerCapture(event.pointerId);
                  }}
                  onPointerMove={(event) => {
                    const start = swipeStart.current;
                    if (!start || start.pointerId !== event.pointerId) return;
                    const deltaX = event.clientX - start.x;
                    const deltaY = event.clientY - start.y;
                    if (Math.abs(deltaX) > 7 && Math.abs(deltaX) > Math.abs(deltaY)) {
                      setCardDrag(Math.max(-170, Math.min(170, deltaX)));
                    }
                  }}
                  onPointerUp={(event) => {
                    const start = swipeStart.current;
                    if (!start || start.pointerId !== event.pointerId) return;
                    const deltaX = event.clientX - start.x;
                    const deltaY = event.clientY - start.y;
                    swipeStart.current = null;
                    setCardDragging(false);
                    if (
                      Math.abs(deltaX) > 52 &&
                      Math.abs(deltaX) > Math.abs(deltaY) * 1.25
                    ) {
                      swipeHandled.current = true;
                      setCardExitOrigin(Math.max(-170, Math.min(170, deltaX)));
                      setCardDrag(0);
                      moveCard(deltaX < 0 ? 1 : -1);
                    } else {
                      setCardDrag(0);
                    }
                  }}
                  onPointerCancel={() => {
                    swipeStart.current = null;
                    setCardDragging(false);
                    setCardDrag(0);
                  }}
                  onAnimationEnd={(event) => {
                    if (event.target !== event.currentTarget) return;
                    if (motionPhase.current === "out") finishCardExit();
                    else if (motionPhase.current === "in") finishCardEnter();
                  }}
                  onClick={(event) => {
                    if (swipeHandled.current) {
                      swipeHandled.current = false;
                      return;
                    }
                    if (motionLocked.current) return;
                    audioTapFeedback(event.currentTarget);
                    if (active.id === "alphabet") {
                      speakAlphabetPart(current, "letter");
                    } else {
                      speak(current);
                    }
                  }}
                >
                  <button className="play" aria-label="Хаза">
                    <AppIcon name="sound" />
                  </button>
                  {active.id !== "alphabet" && (
                    <button
                      className="word-favorite"
                      aria-label="Схьакъастина"
                      aria-pressed={favorites.includes(`${active.id}:${current.id}`)}
                      onClick={(e) => {
                        e.stopPropagation();
                        favoriteFeedback(e.currentTarget, !favorites.includes(`${active.id}:${current.id}`));
                        toggleFavorite(`${active.id}:${current.id}`);
                      }}
                    >
                      <AppIcon
                        name={
                          favorites.includes(`${active.id}:${current.id}`)
                            ? "heart-filled"
                            : "heart"
                        }
                      />
                    </button>
                  )}
                  {active.id === "alphabet" ? (
                    <div className="alphabet-layout">
                      <div
                        className={`alphabet-letter-corner ${letterForms[0]?.length > 2 ? "long-letter" : letterForms[0]?.length > 1 ? "compound-letter" : ""}`}
                      >
                        <strong>{letterForms[0]}</strong>
                        <span>
                          {letterForms[1] || letterForms[0]?.toLowerCase()}
                        </span>
                      </div>
                      <button
                        className="alphabet-picture"
                        aria-label={`${tx(current.example || current.chechen)} хаза`}
                        onClick={(e) => {
                          e.stopPropagation();
                          speakAlphabetPart(current, "word");
                        }}
                      >
                        {current.image ? (
                          <img
                            src={current.image}
                            alt={tx(current.example || "")}
                            draggable={false}
                          />
                        ) : (
                          <span>{current.visual}</span>
                        )}
                      </button>
                    </div>
                  ) : current.image ? (
                    <div className="word-visual illustrated-visual">
                      <img src={current.image} alt="" draggable={false} />
                    </div>
                  ) : current.color ? (
                    <span
                      className="color-orb"
                      style={{ background: current.color }}
                    />
                  ) : (
                    <div
                      className={
                        active.id === "numbers"
                          ? "number-visual"
                          : "word-visual"
                      }
                    >
                      {current.visual}
                    </div>
                  )}
                  <h2>
                    {active.id === "alphabet" ? (
                      <WordLabel word={cardWord(tx(current.example || current.chechen))} classMarker={current.classMarker}>
                      <AlphabetWord
                        word={cardWord(tx(current.example || current.chechen))}
                        letter={letterForms[1] || letterForms[0]?.toLowerCase()}
                      />
                      </WordLabel>
                    ) : (
                      <WordLabel word={cardWord(tx(current.example || current.chechen))} classMarker={current.classMarker}/>
                    )}
                  </h2>
                  <p className="word-latin" lang="ce-Latn">
                    {cardWord(latinize(current.example || current.chechen))}
                  </p>
                  {getWordTranslation(current.russian, settings.translation) && (
                    <p className="word-translation">
                      {getWordTranslation(current.russian, settings.translation)}
                    </p>
                  )}
                </div>
                <div className="pager">
                  <span>
                    {index + 1} / {active.words.length}
                  </span>
                </div>
              </div>
            </section>
          ) : (
            <section className="game-area">
              <div className="listen-task">
                <button
                  onClick={() => target && speak(target)}
                  aria-label="Дош хаза"
                >
                  <AppIcon name="sound" />
                </button>
              </div>
              <div className="answer-grid picture-only">
                {options.map((w) => (
                  <button aria-label={tx(w.chechen)}
                    key={w.id}
                    onClick={() => choose(w)}
                    className={
                      (selected?.id === w.id ? "chosen " : "") +
                      (answer === "right" && w.id === target?.id
                        ? "correct "
                        : "") +
                      (answer === "wrong" && selected?.id === w.id
                        ? "incorrect"
                        : "")
                    }
                  >
                    {w.image ? (
                      <img
                        className="answer-illustration"
                        src={w.image}
                        alt=""
                        draggable={false}
                      />
                    ) : w.color ? (
                      <i
                        className="answer-color"
                        style={{ background: w.color }}
                      />
                    ) : (
                      <b
                        className={
                          active.id === "numbers" ? "answer-number" : ""
                        }
                      >
                        {w.visual}
                      </b>
                    )}
                  </button>
                ))}
              </div>
              <LessonActions>
              <div className={"feedback " + answer} role="status" aria-live="polite">
                {answer === "right" ? (
                  <span className="icon-label">
                    Нийса! <AppIcon name="star" />
                  </span>
                ) : answer === "wrong" ? (
                  "Нийса дац. Йуха хьажа!"
                ) : (
                  null
                )}
              </div>
              {answer === "right" ? (
                <button
                  className="check-button next-button icon-label"
                  onClick={next}
                >
                  РогӀера <AppIcon name="arrow-right" />
                </button>
              ) : (
                <button
                  className="check-button"
                  disabled={!selected}
                  onClick={check}
                >
                  Таллам бе
                </button>
              )}
              </LessonActions>
            </section>
          )}
          {paywall && (
            <Modal className="paywall" label="Массо категореш дӀайоьлла" onClose={() => setPaywall(false)}>
              <div
                className="paywall-card"
              >
                <button
                  className="close-paywall"
                  onClick={() => setPaywall(false)}
                  aria-label="ДӀакъовла"
                >
                  <AppIcon name="close" />
                </button>
                <div className="paywall-icon">
                  <AppIcon name="unlock" />
                </div>
                <h2>Массо категореш дӀайоьлла</h2>
                <p>
                  ДӀаэцар дича, кху а, кхечу а категорешкахь долу массо дешнаш
                  дӀайоьллу.
                </p>
                <strong>2,99 €</strong>
                <span>Цкъа бен мах ца бо · массо приложенин таронаш</span>
                <button className="buy-button" onClick={unlock}>
                  Приложени дӀаэца
                </button>
              </div>
            </Modal>
          )}
        </main>
      </ScriptText>
    );
  }
  return (
    <ScriptText latin={false}>
      <main className="home-shell">
        <header>
          <span className="brand">
            KERLA <i>DOŞ</i>
          </span>
          <span className="header-actions">
            <button
              className="sound"
              onClick={() => setMuted(!muted)}
              aria-label={muted ? "Аз дӀайолайайта" : "Аз дӀайаккха"}
            >
              <AppIcon name={muted ? "mute" : "sound"} />
            </button>
            <button
              className="sound settings-button"
              type="button"
              onClick={() => setSettingsOpen(true)}
              aria-label="ГӀирсаш"
            >
              <AppIcon name="settings" />
            </button>
          </span>
        </header>
        <section className="hero">
          <div>
            <p className="eyebrow">МАРША ДОГӀИЙЛА!</p>
            <h1>
              Нохчийн мотт
              <br /><span>ловзуш Ӏамо</span>
            </h1>
            <p>Хьажа а, ладогӀа а, Ӏамаде а, ловза а</p>
          </div>
        </section>
        <section className="home-progress" aria-label="Кхиам">
          <div className="progress-heading" aria-hidden="true">
            <span />
            <small>САН КХИАМ</small>
            <i />
          </div>
          <button
            className="continue-lesson"
            onClick={() => open(resumeCategory, resumeIndex)}
          >
            <span
              className="continue-art"
              style={{ "--resume-accent": resumeCategory.accent } as React.CSSProperties}
            >
              <img src={resumeCategory.icon} alt="" draggable={false} />
            </span>
            <span className="continue-copy">
              <small>{lastLesson ? "ӀАМОР ДӀАХӀОТТАДЕ" : "ӀАМОР ЙОЛАЙЕ"}</small>
              <strong>{tx(resumeCategory.title)}</strong>
              <em>
                {resumeIndex + 1} / {resumeCategory.words.length}
              </em>
              <i aria-hidden="true">
                <b
                  style={{
                    width: `${((resumeIndex + 1) / resumeCategory.words.length) * 100}%`,
                  }}
                />
              </i>
            </span>
            <span className="continue-arrow" aria-hidden="true">
              <AppIcon name="arrow-right" />
            </span>
          </button>
          <div className="home-stats">
            <span>
              <span className="stat-value">
                <AppIcon name="book" />
                <b>{learnedWords.length}</b>
              </span>
              <small>Ӏамийна дешнаш</small>
            </span>
            <span>
              <span className="stat-value">
                <AppIcon name="heart-filled" />
                <b>{visibleFavorites.length}</b>
              </span>
              <small>Схьакъастина</small>
            </span>
            <span>
              <span className="stat-value">
                <AppIcon name="star" />
                <b>{stars}</b>
              </span>
              <small>Седарчий</small>
            </span>
          </div>
        </section>
        <section className="learning-paths">
          <button
            className="feature-card alphabet-feature"
            style={{ "--card": alphabetCategory.accent } as React.CSSProperties}
            onClick={() => open(alphabetCategory)}
          >
            <span className="feature-badge alphabet-badge">
              <img src={categoryIcons.alphabet} alt="" draggable={false} />
            </span>
            <span className="feature-copy">
              <strong>Абат Ӏамо</strong>
              <em>{alphabetCategory.words.length} элп · хаза · масал</em>
            </span>
          </button>
          <button
            className="feature-card numbers-feature"
            style={{ "--card": categories[1].accent } as React.CSSProperties}
            onClick={() => open(categories[1])}
          >
            <span className="feature-badge numbers-badge">
              <img src={categoryIcons.numbers} alt="" draggable={false} />
            </span>
            <span className="feature-copy">
              <strong>Лоруш Ӏамо</strong>
              <em>0–30 · декъана</em>
            </span>
          </button>
          <button
            className="feature-card categories-feature"
            onClick={() => setHomeView("categories")}
          >
            <span className="category-preview" aria-hidden="true">
              <img src={categoryIcons.school} alt="" draggable={false} />
              <img src={categoryIcons.clothes} alt="" draggable={false} />
            </span>
            <span className="feature-copy">
              <strong>Дешнийн тобанаш</strong>
              <em>12 тоба · дешнаш а, ловзарш а</em>
            </span>
          </button>
        </section>
        <section className="content-directions">
          <div className="direction-grid">
            <button
              className="direction-card games-direction"
              onClick={() => setHomeView("games")}
            >
              <span><AppIcon name="puzzle" /></span>
              <strong>Ловзарш</strong>
              <small>Дош гулде · мозаика</small>
            </button>
            <button
              className="direction-card random-direction"
              onClick={() => setHomeView("random")}
            >
              <span>
                <img
                  src="/icons/sections/random.png"
                  alt=""
                  draggable={false}
                />
              </span>
              <strong>Дешнаш Ӏамо</strong>
              <small>Ца хаьржина дош гайта</small>
            </button>
            <button
              className="direction-card favorite-direction"
              onClick={() => setHomeView("favorites")}
            >
              <span>
                <img
                  src="/icons/sections/favorites.png"
                  alt=""
                  draggable={false}
                />
              </span>
              <strong>Схьакъастина</strong>
              <small>
                {visibleFavorites.length
                  ? `${visibleFavorites.length} дош йуха Ӏамо`
                  : "Дешнаш лардийла"}
              </small>
            </button>
            <button
              className="direction-card stories-direction"
              onClick={() => setHomeView("stories")}
            >
              <span>
                <img
                  src="/icons/sections/stories.png"
                  alt=""
                  draggable={false}
                />
              </span>
              <strong>Деша</strong>
              <small>Хаза а, деша а</small>
            </button>
          </div>
        </section>
        <footer>
          <span>KERLA DOŞ</span>
          <p>Даймехкан мотт — берашна</p>
          <small className="footer-credits">© 2026 daxt agency · v1.0</small>
        </footer>
        {settingsOpen && (
          <SettingsPanel
            value={settings}
            onChange={saveSettings}
            stars={stars}
            premium={premium}
            onPreviewFree={() => {
              update("premium", false);
              setSettingsOpen(false);
            }}
            onClose={() => setSettingsOpen(false)}
            onReset={() => {
              if (confirm("Кхиам дӀабаккха?")) {
                update("stars", 0);
                update("learnedWords", []);
              }
            }}
          />
        )}
      </main>
    </ScriptText>
  );
}
