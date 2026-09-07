"use client";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import ScriptText, { latinize } from "./script-text";
import { cardWord } from "./chechen-orthography.mjs";
import FullStory from "./full-story";
import GameCenter from "./game-center";
import AppIcon from "./ui-icon";
import WordLabel from "./word-label";
import { audioTapFeedback } from "./audio-tap-feedback";
import { favoriteFeedback } from "./favorite-feedback";
export type LearningItem = {
    key: string;
    word: string;
    visual: string;
    categoryId: string;
    category: string;
    color?: string;
    image?: string;
    audioSrc?: string;
    classMarker?: string;
};
type View = "random" | "favorites" | "stories" | "games";
const tales = [
    { id: "borz-ka", image: "/stories/borz-ka/cover.png", title: "Борз а, къена ка а", summary: "Харц дуьйнах а, кхетамах а лаьцна йоккха туьйра", text: [] },
    { id: "fox", image: "/stories/borz-ka/scene-06.png", title: "Цхьогал а, кемсаш а", summary: "Кхетаме цхьогалх а, стомах а лаьцна туьйра", text: ["Цкъа цхьа цхьогал хьуьн чохь лелаш хилла.", "Цунна лакхахь долу кемсаш гина. Цхьогал дукха хьийзира, амма кемсаш кхаьчна дац.", "Цул тӀаьхьа цо аьлла: «И кемсаш кӀорга ду», — аьлла, дӀавахана."] },
    { id: "friends", image: "/stories/borz-ka/scene-05.png", title: "Ши доттагӀ", summary: "ДоттагӀаллех а, вовшашка гӀо дарх а лаьцна", text: ["Цхьана хьуьн чохь ши доттагӀ вехаш хилла.", "Цара даима вовшашка гӀо дора, йаахӀума екъара, цхьаьна ловзара.", "Бакъ доттагӀ халачу хенахь гуш ву."] },
    { id: "sun", image: "/stories/borz-ka/scene-01.png", title: "Малх а, морх а", summary: "Ӏаламах а, де дика хиларх а лаьцна", text: ["Ӏуьйранна стиглахь морхаш хилла.", "ТӀаккха малх арабаьлла, хьуьн серлайаьлла.", "Берийн самукъадала ловзуш арадаьлла."] }
];

function RandomLearning({
    item,
    favorites,
    premium,
    sessionSize,
    sessionStep,
    onFavorite,
    onChooseSize,
    onNext,
    onSpeak,
}: {
    item: LearningItem;
    favorites: string[];
    premium: boolean;
    sessionSize: number;
    sessionStep: number;
    onFavorite: (key: string) => void;
    onChooseSize: (size: number) => void;
    onNext: () => void;
    onSpeak: (word: string, audioSrc?: string) => void;
}) {
    const complete = sessionStep >= sessionSize;
    const progress = Math.round((sessionStep / sessionSize) * 100);

    return (
        <section className="random-zone random-learning-zone">
            <div className="random-heading">
                <strong className="random-label">ДЕШНАШ ӀАМО</strong>
                <div className="random-counter" aria-label={`${sessionStep} / ${sessionSize}`}>
                    <strong>{sessionStep}</strong>
                    <span>/ {sessionSize}</span>
                </div>
            </div>

            <div className="random-workspace">
                <aside className="random-controls">
                    <h2>Масийтта дош Ӏамо?</h2>
                    <div className="random-size-options" role="group" aria-label="Дешнийн дукхалла">
                        {[10, 20, 30, 40, 50].map(size => (
                            <button
                                key={size}
                                type="button"
                                disabled={!premium && size > 10}
                                aria-pressed={sessionSize === size}
                                className={sessionSize === size ? "active" : ""}
                                onClick={() => onChooseSize(size)}
                            >
                                {!premium && size > 10 && <AppIcon name="lock" />}
                                {size}
                            </button>
                        ))}
                    </div>
                    <div className="random-progress" aria-hidden="true">
                        <span style={{ width: `${progress}%` }} />
                    </div>
                    <p className="random-tip">
                        <AppIcon name="heart" />
                        Дош схьакъастина лардан дог тӀетаӀайе
                    </p>
                </aside>

                <div className="random-study">
                    <div className="random-card" onClick={event => { audioTapFeedback(event.currentTarget); onSpeak(item.word, item.audioSrc); }}>
                        <div className="random-card-actions">
                            <button
                                type="button"
                                className="random-heart"
                                onClick={event => {
                                    event.stopPropagation();
                                    favoriteFeedback(event.currentTarget, !favorites.includes(item.key));
                                    onFavorite(item.key);
                                }}
                                aria-label="Схьакъастина"
                                aria-pressed={favorites.includes(item.key)}
                            >
                                <AppIcon name={favorites.includes(item.key) ? "heart-filled" : "heart"} />
                            </button>
                            <button
                                type="button"
                                className="random-sound"
                                onClick={event => {
                                    event.stopPropagation();
                                    audioTapFeedback(event.currentTarget);
                                    onSpeak(item.word, item.audioSrc);
                                }}
                                aria-label="Хаза"
                            >
                                <AppIcon name="sound" />
                            </button>
                        </div>
                        <div
                            className="random-visual"
                            style={!item.image && item.color ? { background: item.color } : {}}
                        >
                            {item.image ? <img src={item.image} alt="" draggable={false} /> : item.color ? "" : item.visual}
                        </div>
                        <h2><WordLabel word={cardWord(item.word)} classMarker={item.classMarker}/></h2>
                        <p className="random-latin" lang="ce-Latn">{cardWord(latinize(item.word))}</p>
                        <span className="random-category">{item.category}</span>
                    </div>
                    <button type="button" className="next-random icon-label" onClick={onNext}>
                        <AppIcon name={complete ? "refresh" : "dice"} />
                        {complete ? "Йуха волавала" : "Кхин дош"}
                    </button>
                </div>
            </div>
        </section>
    );
}
export default function HomeExtras({ view, items, favorites, onFavorite, onBack, rate, volume, latin, premium, mosaicPieces, mosaicMode }: {
    view: View;
    items: LearningItem[];
    favorites: string[];
    onFavorite: (key: string) => void;
    onBack: () => void;
    rate: number;
    volume: number;
    latin: boolean;
    premium: boolean;
    mosaicPieces: 6 | 9 | 12 | 15;
    mosaicMode: "tray" | "swap";
}) {
    const [random, setRandom] = useState(() => Math.floor(Math.random() * Math.max(1, items.length))), [story, setStory] = useState<(typeof tales)[number] | null>(null), [storyAudioState, setStoryAudioState] = useState<"idle" | "playing" | "paused">("idle"), [sessionSize, setSessionSize] = useState(10), [sessionStep, setSessionStep] = useState(1), [favoriteIndex, setFavoriteIndex] = useState(0);
    const wordAudio = useRef<HTMLAudioElement | null>(null);
    const wordAudioRequest = useRef(0);
    const item = items[random % Math.max(1, items.length)];
    const saved = useMemo(() => items.filter(x => favorites.includes(x.key)), [items, favorites]);
    const favoriteItem = saved.length ? saved[favoriteIndex % saved.length] : null;
    function stopWordAudio() {
        wordAudioRequest.current += 1;
        const clip = wordAudio.current;
        wordAudio.current = null;
        if (clip) {
            clip.pause();
            clip.removeAttribute("src");
            clip.load();
        }
        if ("speechSynthesis" in window) speechSynthesis.cancel();
    }
    useLayoutEffect(() => () => stopWordAudio(), [view, item?.key, favoriteItem?.key]);
    function nextRandom() {
        stopWordAudio();
        if (sessionStep >= sessionSize)
            setSessionStep(1);
        else
            setSessionStep(x => x + 1);
        setRandom(current => {
            if (items.length < 2)
                return 0;
            let next = current;
            while (next === current)
                next = Math.floor(Math.random() * items.length);
            return next;
        });
    }
    function chooseSessionSize(size: number) {
        if (!premium && size > 10)
            return;
        setSessionSize(size);
        setSessionStep(1);
        setRandom(Math.floor(Math.random() * Math.max(1, items.length)));
    }
    function say(text: string, audioSrc?: string) {
        stopWordAudio();
        const request = wordAudioRequest.current;
        const fallback = () => {
            if (request !== wordAudioRequest.current || !("speechSynthesis" in window))
                return;
            const u = new SpeechSynthesisUtterance(text);
            u.lang = "ru-RU";
            u.rate = rate;
            u.volume = volume;
            speechSynthesis.speak(u);
        };
        if (!audioSrc) {
            fallback();
            return;
        }
        const clip = new Audio(audioSrc);
        clip.volume = volume;
        wordAudio.current = clip;
        clip.play().catch(fallback);
    }
    function toggleStoryAudio() {
        if (!story || !("speechSynthesis" in window))
            return;
        if (storyAudioState === "playing") {
            speechSynthesis.pause();
            setStoryAudioState("paused");
            return;
        }
        if (storyAudioState === "paused") {
            speechSynthesis.resume();
            setStoryAudioState("playing");
            return;
        }
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(story.text.join(" "));
        u.lang = "ru-RU";
        u.rate = rate;
        u.volume = volume;
        u.onend = () => setStoryAudioState("idle");
        u.onerror = () => setStoryAudioState("idle");
        speechSynthesis.speak(u);
        setStoryAudioState("playing");
    }
    function closeStory() {
        if ("speechSynthesis" in window)
            speechSynthesis.cancel();
        setStoryAudioState("idle");
        setStory(null);
    }
    function leaveStory() {
        if ("speechSynthesis" in window)
            speechSynthesis.cancel();
        setStoryAudioState("idle");
        onBack();
    }
    if (story?.id === "borz-ka")
        return <ScriptText latin={latin}><FullStory rate={rate} volume={volume} onBack={closeStory}/></ScriptText>;
    if (story)
        return <ScriptText latin={latin}><main className="extra-shell extra-theme-stories"><header><button className="back icon-label" onClick={closeStory}><AppIcon name="arrow-left"/> <span>Хьалха</span></button><a className="brand" onClick={leaveStory}>KERLA <i>DOŞ</i></a></header><article className="story-reader"><div><img src={story.image} alt=""/></div><small>ТУЬЙРА</small><h1>{story.title}</h1>{story.text.map((paragraph, index) => <p key={index}>{paragraph}</p>)}<button className="icon-label" onClick={toggleStoryAudio}><AppIcon name={storyAudioState === "playing" ? "pause" : "play"}/>{storyAudioState === "playing" ? "Соцаде" : storyAudioState === "paused" ? "ДӀахӀоттаде" : "Туьйра хаза"}</button></article></main></ScriptText>;
    if (view === "games")
        return <ScriptText latin={latin}><GameCenter items={items} onBack={onBack} mosaicPieces={mosaicPieces} mosaicMode={mosaicMode}/></ScriptText>;
    if (view === "random" && item)
        return (
            <ScriptText latin={latin}>
                <main className="extra-shell random-extra-shell extra-theme-random">
                    <header>
                        <button className="back icon-label" onClick={onBack}>
                            <AppIcon name="arrow-left" /> <span>Коьртачу агӀор</span>
                        </button>
                        <a className="brand" onClick={onBack}>KERLA <i>DOŞ</i></a>
                        <span className="extra-count icon-label">
                            {favorites.length} <AppIcon name="heart-filled" />
                        </span>
                    </header>
                    <RandomLearning
                        item={item}
                        favorites={favorites}
                        premium={premium}
                        sessionSize={sessionSize}
                        sessionStep={sessionStep}
                        onFavorite={onFavorite}
                        onChooseSize={chooseSessionSize}
                        onNext={nextRandom}
                        onSpeak={say}
                    />
                </main>
            </ScriptText>
        );
return <ScriptText latin={latin}><main className={`extra-shell extra-theme-${view}`}><header><button className="back icon-label" onClick={onBack}><AppIcon name="arrow-left"/> <span>Коьртачу агӀор</span></button><a className="brand" onClick={onBack}>KERLA <i>DOŞ</i></a><span className="extra-count icon-label">{favorites.length} <AppIcon name="heart-filled"/></span></header>{view === "random" && item && <section className="random-zone"><small>ХӀИНЦАЛЕРА ДОШ</small><h1>Тайп-тайпана дешнаш Ӏамо</h1><div className="random-session"><span>Масийтта дош Ӏамо?</span><div>{[10, 20, 30, 40, 50].map(size => <button key={size} disabled={!premium && size > 10} className={sessionSize === size ? "active" : ""} onClick={() => chooseSessionSize(size)}>{!premium && size > 10 && <AppIcon name="lock"/>}{size}</button>)}</div><small>{sessionStep} / {sessionSize}</small></div><div className="random-card"><button className="favorite-button" onClick={() => onFavorite(item.key)} aria-label="Схьакъастина"><AppIcon name={favorites.includes(item.key) ? "heart-filled" : "heart"}/></button><div className="random-visual" style={!item.image && item.color ? { background: item.color } : {}}>{item.image ? <img src={item.image} alt="" draggable={false}/> : item.color ? "" : item.visual}</div><h2><WordLabel word={cardWord(item.word)} classMarker={item.classMarker}/></h2><p>{item.category}</p><button className="random-audio icon-label" onClick={() => say(item.word, item.audioSrc)}><AppIcon name="sound"/> Хаза</button></div><button className="next-random icon-label" onClick={nextRandom}><AppIcon name={sessionStep >= sessionSize ? "refresh" : "dice"}/>{sessionStep >= sessionSize ? "Йуха волавала" : "Кхин дош"}</button><p className="random-note"><span className="icon-label">Схьакъастина <AppIcon name="heart-filled"/></span> тӀетаӀайе — и йуха Ӏаморан могӀанна тӀекхочур ду.</p></section>}{view === "favorites" && <section className="favorites-zone favorite-learning"><small>ЙУХА ӀАМОР</small><h1>Схьакъастина дешнаш</h1>{!favoriteItem ? <div className="empty-favorites"><span><AppIcon name="heart"/></span><h2>ХӀинца дешнаш дац</h2><p>«Тайп-тайпана дешнаш Ӏамо» декъехь дог тӀетаӀайе.</p></div> : <><p className="review-intro">{saved.length} дош йуха Ӏаморан могӀанехь ду</p><div className="card-stage"><div className="big-card favorite-study-card" onClick={event => { audioTapFeedback(event.currentTarget); say(favoriteItem.word, favoriteItem.audioSrc); }}><button className="play" aria-label="Хаза"><AppIcon name="sound"/></button><button className="word-favorite" aria-label="ДӀадаккха" onClick={event => { event.stopPropagation(); favoriteFeedback(event.currentTarget, false); onFavorite(favoriteItem.key); }}><AppIcon name="heart-filled"/></button>{favoriteItem.image ? <div className="word-visual illustrated-visual"><img src={favoriteItem.image} alt="" draggable={false}/></div> : favoriteItem.color ? <span className="color-orb" style={{ background: favoriteItem.color }}/> : <div className="word-visual">{favoriteItem.visual}</div>}<h2><WordLabel word={cardWord(favoriteItem.word)} classMarker={favoriteItem.classMarker}/></h2><small>{favoriteItem.category}</small></div><div className="pager"><button onClick={() => setFavoriteIndex(i => i === 0 ? saved.length - 1 : i - 1)} aria-label="Хьалхара"><AppIcon name="arrow-left"/></button><span>{favoriteIndex % saved.length + 1} / {saved.length}</span><button onClick={() => setFavoriteIndex(i => (i + 1) % saved.length)} aria-label="РогӀера"><AppIcon name="arrow-right"/></button></div></div></>}</section>}{view === "stories" && <section className="stories-zone"><small>ХАЗА А, ДЕША А</small><h1>Туьйранаш</h1><p>Дуьххьарлера жиманиг туьйранаш берашца дешарна.</p><div className="story-grid">{tales.map((tale, index) => <button key={tale.id} onClick={() => setStory(tale)}><b><img src={tale.image} alt=""/></b><span><small>{index + 1}-ГӀА ТУЬЙРА</small><strong>{tale.title}</strong><em>{tale.summary}</em></span></button>)}</div></section>}</main></ScriptText>;
}
