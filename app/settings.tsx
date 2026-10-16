"use client";
import Modal from "./components/modal";
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
    mosaicMode: "tray" | "swap";
    reviewErrors: boolean;
    dailyGoal: 5 | 10 | 15;
};

export const defaultSettings: Settings = { script: "cyrillic", translation: "off", volume: .9, rate: .72, autoSpeak: true, repeat: false, gameSounds: true, largeText: false, reduceMotion: false, difficulty: 4, mosaicPieces: 9, mosaicMode: "tray", reviewErrors: true, dailyGoal: 10 };

function Toggle({ on, change, label }: { label: string; on: boolean; change: (v: boolean) => void }) {
    return <button className={"toggle " + (on ? "on" : "")} onClick={() => change(!on)} aria-pressed={on} aria-label={label}><i/></button>;
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
        <Modal className="settings-backdrop" label="ГӀирсаш" onClose={onClose}>
            <section className="settings-panel">
                <header>
                    <div><small>KERLA DOŞ</small><h2>ГӀирсаш</h2></div>
                    <button onClick={onClose} aria-label="ДӀакъовла"><AppIcon name="close"/></button>
                </header>
                <div className="settings-scroll">
                    <h3>Карточкан йоза</h3>
                    <label className="select-row" htmlFor="setting-translation"><span><b>Гочдар гайта</b><small>Дош кхечу маттахь</small></span><select id="setting-translation" value={value.translation} onChange={event => set("translation", event.target.value as TranslationLanguage)}><option value="off">ДӀадаьккхина</option><option value="ru">Русский</option><option value="en">English</option><option value="de">Deutsch</option></select></label>
                    <h3>Хазар</h3>
                    <label className="range-row" htmlFor="setting-volume"><span><b className="icon-label"><AppIcon name="sound"/> Аз</b><small>{Math.round(value.volume * 100)}%</small></span><input id="setting-volume" type="range" min="0" max="1" step=".1" value={value.volume} onChange={event => set("volume", Number(event.target.value))}/></label>
                    <label className="range-row" htmlFor="setting-rate"><span><b className="icon-label"><AppIcon name="turtle"/> Хазар сихалла</b><small>{value.rate < .7 ? "Меллаша" : value.rate > 1 ? "Сиха" : "Леррина"}</small></span><input id="setting-rate" type="range" min=".5" max="1.2" step=".1" value={value.rate} onChange={event => set("rate", Number(event.target.value))}/></label>
                    <div className="setting-row"><span><b>Карточка йилличахь хаза</b><small>Дош ша-ша хаза</small></span><Toggle label="Карточка йилличахь хаза" on={value.autoSpeak} change={next => set("autoSpeak", next)}/></div>
                    <div className="setting-row"><span><b>Дош шозза ала</b><small>Дагохь латтадан гӀо</small></span><Toggle label="Дош шозза ала" on={value.repeat} change={next => set("repeat", next)}/></div>
                    <div className="setting-row"><span><b>Ловзаран аьзнаш</b><small>Нийса жоп а, седарчий а</small></span><Toggle label="Ловзаран аьзнаш" on={value.gameSounds} change={next => set("gameSounds", next)}/></div>
                    <h3>Ӏамор</h3>
                    <div className="setting-row"><span><b>Йоккха йоза</b><small>Дешнаш кхин йоккха хила</small></span><Toggle label="Йоккха йоза" on={value.largeText} change={next => set("largeText", next)}/></div>
                    <div className="setting-row"><span><b>Анимаци йац</b><small>ДӀасахьовзар дӀадаккха</small></span><Toggle label="Анимаци йац" on={value.reduceMotion} change={next => set("reduceMotion", next)}/></div>
                    <label className="select-row" htmlFor="setting-difficulty"><span><b>Ловзаран халонаш</b><small>Масийтта жоп харжар ду</small></span><select id="setting-difficulty" value={value.difficulty} onChange={event => set("difficulty", Number(event.target.value) as 2 | 3 | 4)}><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></label>
                    <label className="select-row" htmlFor="setting-mosaicPieces"><span><b>Мозаикан дакъош</b><small>Сурт масех дакъах гулдийр ду</small></span><select id="setting-mosaicPieces" value={value.mosaicPieces} onChange={event => set("mosaicPieces", Number(event.target.value) as 6 | 9 | 12 | 15)}><option value="6">6 дакъа</option><option value="9">9 дакъа</option><option value="12">12 дакъа</option><option value="15">15 дакъа</option></select></label>
                    <label className="select-row" htmlFor="setting-mosaicMode"><span><b>Мозаика гулдаран кеп</b><small>Дакъош мичара харжар ду</small></span><select id="setting-mosaicMode" value={value.mosaicMode} onChange={event => set("mosaicMode", event.target.value as "tray" | "swap")}><option value="tray">Дакъош лахахь</option><option value="swap">Дакъош суьрта тӀехь</option></select></label>
                    <div className="setting-row"><span><b>ГӀалаташ йуха Ӏамо</b><small>Хала дешнаш дуккха гайта</small></span><Toggle label="ГӀалаташ йуха Ӏамо" on={value.reviewErrors} change={next => set("reviewErrors", next)}/></div>
                    <label className="select-row" htmlFor="setting-dailyGoal"><span><b>Ден Ӏамор</b><small>Масех дош хьажа</small></span><select id="setting-dailyGoal" value={value.dailyGoal} onChange={event => set("dailyGoal", Number(event.target.value) as 5 | 10 | 15)}><option value="5">5 дош</option><option value="10">10 дош</option><option value="15">15 дош</option></select></label>
                    <h3>Дена-нанна</h3>
                    <div className="progress-card"><span><AppIcon name="star"/></span><div><b>{stars} седарчий</b><small>Ден Ӏамор: {Math.min(stars, value.dailyGoal)} / {value.dailyGoal}</small><i><em style={{ width: `${Math.min(100, stars / value.dailyGoal * 100)}%` }}/></i></div></div>
                    {premium && <button className="preview-free icon-label" onClick={onPreviewFree}><AppIcon name="lock"/> Бекхамза верси хьажа</button>}
                    <button className="restore" onClick={() => alert("ДӀаэцнарг карладаккхар тӀедогӀучу версехь хир ду")}>ДӀаэцнарг карладаккха</button>
                    <button className="reset-progress" onClick={onReset}>Кхиам дӀабаккха</button>
                    <p className="settings-note">Массо гӀирс кху гӀирс тӀехь ларло.</p>
                </div>
            </section>
        </Modal>
    </>;
}
