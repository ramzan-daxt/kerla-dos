"use client";
import AppIcon from "./ui-icon";
import type { TranslationLanguage } from "./word-translations";

export type Settings = {
    script: "cyrillic" | "latin";
    translation: TranslationLanguage;
    volume: number;
    rate: number;
    autoSpeak: boolean;
    repeat: boolean;
    gameSounds: boolean;
    largeText: boolean;
    reduceMotion: boolean;
    difficulty: 2 | 3 | 4;
    mosaicPieces: 6 | 9 | 12 | 15;
    reviewErrors: boolean;
    dailyGoal: 5 | 10 | 15;
};

export const defaultSettings: Settings = { script: "cyrillic", translation: "off", volume: .9, rate: .72, autoSpeak: true, repeat: false, gameSounds: true, largeText: false, reduceMotion: false, difficulty: 4, mosaicPieces: 9, reviewErrors: true, dailyGoal: 10 };

function Toggle({ on, change }: { on: boolean; change: (v: boolean) => void }) {
    return <button className={"toggle " + (on ? "on" : "")} onClick={() => change(!on)} aria-pressed={on}><i/></button>;
}

export default function SettingsPanel({ value, onChange, stars, onClose, onReset, onPreviewFree, premium }: {
    value: Settings;
    onChange: (v: Settings) => void;
    stars: number;
    onClose: () => void;
    onReset: () => void;
    onPreviewFree: () => void;
    premium: boolean;
}) {
    const set = <K extends keyof Settings>(key: K, next: Settings[K]) => onChange({ ...value, [key]: next });
    return <>
        <div className="settings-backdrop" onClick={onClose}>
            <section className="settings-panel" onClick={event => event.stopPropagation()}>
                <header>
                    <div><small>KERLA DOŞ</small><h2>ГӀирсаш</h2></div>
                    <button onClick={onClose} aria-label="ДӀакъовла"><AppIcon name="close"/></button>
                </header>
                <div className="settings-scroll">
                    <h3>Карточкан йоза</h3>
                    <label className="select-row"><span><b>Гочдар гайта</b><small>Дош кхечу маттахь</small></span><select value={value.translation} onChange={event => set("translation", event.target.value as TranslationLanguage)}><option value="off">ДӀадаьккхина</option><option value="ru">Русский</option><option value="en">English</option><option value="de">Deutsch</option></select></label>
                    <h3>Хазар</h3>
                    <label className="range-row"><span><b className="icon-label"><AppIcon name="sound"/> Аз</b><small>{Math.round(value.volume * 100)}%</small></span><input type="range" min="0" max="1" step=".1" value={value.volume} onChange={event => set("volume", Number(event.target.value))}/></label>
                    <label className="range-row"><span><b className="icon-label"><AppIcon name="turtle"/> Хазар сихалла</b><small>{value.rate < .7 ? "Меллаша" : value.rate > 1 ? "Сиха" : "Леррина"}</small></span><input type="range" min=".5" max="1.2" step=".1" value={value.rate} onChange={event => set("rate", Number(event.target.value))}/></label>
                    <div className="setting-row"><span><b>Карточка йилличахь хаза</b><small>Дош ша-ша хаза</small></span><Toggle on={value.autoSpeak} change={next => set("autoSpeak", next)}/></div>
                    <div className="setting-row"><span><b>Дош шозза ала</b><small>Дагохь латтадан гӀо</small></span><Toggle on={value.repeat} change={next => set("repeat", next)}/></div>
                    <div className="setting-row"><span><b>Ловзаран аьзнаш</b><small>Нийса жоп а, седарчий а</small></span><Toggle on={value.gameSounds} change={next => set("gameSounds", next)}/></div>
                    <h3>Ӏамор</h3>
                    <div className="setting-row"><span><b>Йоккха йоза</b><small>Дешнаш кхин йоккха хила</small></span><Toggle on={value.largeText} change={next => set("largeText", next)}/></div>
                    <div className="setting-row"><span><b>Анимаци йац</b><small>ДӀасахьовзар дӀадаккха</small></span><Toggle on={value.reduceMotion} change={next => set("reduceMotion", next)}/></div>
                    <label className="select-row"><span><b>Ловзаран халонаш</b><small>Масийтта жоп харжар ду</small></span><select value={value.difficulty} onChange={event => set("difficulty", Number(event.target.value) as 2 | 3 | 4)}><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></label>
                    <label className="select-row"><span><b>Мозаикан дакъош</b><small>Сурт масех дакъах гулдийр ду</small></span><select value={value.mosaicPieces} onChange={event => set("mosaicPieces", Number(event.target.value) as 6 | 9 | 12 | 15)}><option value="6">6 дакъа</option><option value="9">9 дакъа</option><option value="12">12 дакъа</option><option value="15">15 дакъа</option></select></label>
                    <div className="setting-row"><span><b>ГӀалаташ юха Ӏамо</b><small>Хала дешнаш дуккха гайта</small></span><Toggle on={value.reviewErrors} change={next => set("reviewErrors", next)}/></div>
                    <label className="select-row"><span><b>Ден Ӏамор</b><small>Масех дош хьажа</small></span><select value={value.dailyGoal} onChange={event => set("dailyGoal", Number(event.target.value) as 5 | 10 | 15)}><option value="5">5 дош</option><option value="10">10 дош</option><option value="15">15 дош</option></select></label>
                    <h3>Дена-нанна</h3>
                    <div className="progress-card"><span><AppIcon name="star"/></span><div><b>{stars} седарчий</b><small>Ден Ӏамор: {Math.min(stars, value.dailyGoal)} / {value.dailyGoal}</small><i><em style={{ width: `${Math.min(100, stars / value.dailyGoal * 100)}%` }}/></i></div></div>
                    {premium && <button className="preview-free icon-label" onClick={onPreviewFree}><AppIcon name="lock"/> Бекхамза верси хьажа</button>}
                    <button className="restore" onClick={() => alert("ДӀаэцнарг карладаккхар тӀедогӀучу версехь хир ду")}>ДӀаэцнарг карладаккха</button>
                    <button className="reset-progress" onClick={onReset}>Кхиам дӀабаккха</button>
                    <p className="settings-note">Массо гӀирс кху гӀирс тӀехь ларло.</p>
                </div>
            </section>
        </div>
    </>;
}
