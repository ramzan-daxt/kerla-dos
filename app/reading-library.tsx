"use client";
import {useEffect, useRef, useState} from "react";
import AppIcon from "./ui-icon";
import BookPageTurn, {type BookTurnHandle} from "./book-page-turn";
import {adamParagraphs, adamSources, adamTitle, adamSubtitle} from "./adam-story.mjs";
import {adamArt} from "./adam-art.mjs";

function AdamBook({onBack}:{onBack:()=>void}) {
  const [page,setPage]=useState(0);
  const book=useRef<BookTurnHandle>(null);
  const last=adamParagraphs.length+1;
  useEffect(()=>{
    const key=(event:KeyboardEvent)=>{
      if(event.key==="ArrowRight"){event.preventDefault();book.current?.turnTo(page+1);}
      if(event.key==="ArrowLeft"){event.preventDefault();book.current?.turnTo(page-1);}
      if(event.key==="Escape")onBack();
    };
    window.addEventListener("keydown",key);
    return()=>window.removeEventListener("keydown",key);
  },[page,onBack]);
  useEffect(()=>{
    for(const next of [page-1,page+1]) if(next>0&&next<=adamParagraphs.length){
      const image=new Image();image.src=adamArt[next-1].image;
    }
  },[page]);
  function renderPage(index:number){
    if(index===0)return <article className="adam-page adam-cover" aria-label={`${adamTitle}, ${adamSubtitle}`}>
      <img src="/stories/adam/cover-v1.png" alt={`${adamTitle}, ${adamSubtitle}`} draggable={false}/>
    </article>;
    if(index===last)return <article className="adam-page adam-sources">
      <h2>Хьосташ</h2>
      <ol>{adamSources.map(source=><li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.label}</a></li>)}</ol>
    </article>;
    return <article className={`adam-page adam-narrative copy-${adamArt[index-1].edge}`} aria-label={`${index} / 8`}>
      <img src={adamArt[index-1].image} alt="" draggable={false}/>
      <div className="adam-wash"><div className="adam-copy">{adamParagraphs[index-1].map(text=><p key={text}>{text}</p>)}</div></div>
    </article>;
  }
  return <main className="adam-reader">
    <div className="adam-toolbar"><button onClick={onBack} aria-label="Деша"><AppIcon name="arrow-left"/></button><span>Деша</span></div>
    <BookPageTurn ref={book} index={page} lastIndex={last} renderPage={renderPage} onStart={()=>{}} onFinish={next=>{if(next!==null)setPage(next);}}/>
    <nav className="adam-navigation" aria-label="АгӀонаш">
      <button disabled={page===0} onClick={()=>book.current?.turnTo(page-1)} aria-label="Хьалхара"><AppIcon name="arrow-left"/></button>
      <span aria-live="polite">{page===0?"Деша":page===last?"Хьосташ":`${page} / 8`}</span>
      <button disabled={page===last} onClick={()=>book.current?.turnTo(page+1)} aria-label="РогӀера"><AppIcon name="arrow-right"/></button>
    </nav>
  </main>;
}

export default function ReadingLibrary({onBack}:{onBack:()=>void}){
  const [section,setSection]=useState("Сира");
  const [open,setOpen]=useState(false);
  if(open)return <AdamBook onBack={()=>setOpen(false)}/>;
  return <main className="reading-library">
    <header><button onClick={onBack} aria-label="Коьртачу агӀор"><AppIcon name="arrow-left"/></button><h1>Деша</h1></header>
    <div className="reading-sections" role="group" aria-label="Деша">
      {["Туьйранаш","Дийцараш","Сира"].map(name=><button key={name} aria-pressed={section===name} onClick={()=>setSection(name)}>{name}</button>)}
    </div>
    {section==="Сира"?<section className="reading-shelf"><button className="adam-library-cover" onClick={()=>setOpen(true)} aria-label={adamTitle}>
      <img src="/stories/adam/cover-v1.png" alt={`${adamTitle}, ${adamSubtitle}`}/>
      <span><AppIcon name="book"/> Деша</span>
    </button></section>:<div className="reading-empty"><AppIcon name="book"/><p>Кестта</p></div>}
  </main>;
}
