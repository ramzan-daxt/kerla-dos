"use client";
import {useEffect, useRef, useState} from "react";
import AppIcon from "./ui-icon";
import BookPageTurn, {type BookTurnHandle} from "./book-page-turn";
import {readingBooks} from "./reading-books.mjs";
import {filterReadingBooks,readingSections} from "./reading-filter.mjs";
import {createStoryAudio,storyRecording} from "./story-audio.mjs";

type ReadingBook = (typeof readingBooks)[number];

function CoverText({story}:{story:ReadingBook}){
  if(!story.coverText)return null;
  return <div className="reading-cover-text" data-book={story.id} aria-hidden="true">
    <h2>{story.coverName}</h2>
  </div>;
}

function StoryBook({story,onBack}:{story:ReadingBook;onBack:()=>void}) {
  const [page,setPage]=useState(0);
  const book=useRef<BookTurnHandle>(null);
  const last=story.paragraphs.length+2;
  const [audioStatus,setAudioStatus]=useState('idle');
  const [feedback,setFeedback]=useState<{icon:'play'|'pause';key:number}|null>(null);
  const player=useRef<ReturnType<typeof createStoryAudio>|null>(null);
  const autoNext=useRef(false);
  const turning=useRef(false);
  const resumeAfterCancel=useRef(false);
  const currentPage=useRef(page);
  useEffect(()=>{currentPage.current=page;},[page]);
  const flashTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const narrative=page>=2&&page<last;
  const recording=storyRecording(story.id,Math.max(1,page-1));
  function flash(icon:'play'|'pause'){
    if(flashTimer.current)clearTimeout(flashTimer.current);
    setFeedback({icon,key:Date.now()});
    flashTimer.current=setTimeout(()=>setFeedback(null),450);
  }
  async function play(){if(await player.current?.play())flash('play');}
  function toggleAudio(){
    if(turning.current)return;
    if(!narrative){autoNext.current=true;book.current?.turnTo(2);return;}
    if(player.current?.status==='playing'||player.current?.status==='loading'){
      autoNext.current=false;player.current.pause();flash('pause');
    }else void play();
  }
  useEffect(()=>{
    const audio=new Audio();audio.preload='auto';
    player.current=createStoryAudio(audio,(status:string)=>setAudioStatus(status),()=>{
      const next=currentPage.current+1;
      if(next<last){autoNext.current=true;book.current?.turnTo(next);}
    });
    const hidden=()=>{if(document.hidden){autoNext.current=false;resumeAfterCancel.current=false;player.current?.pause();}};
    document.addEventListener('visibilitychange',hidden);
    return()=>{document.removeEventListener('visibilitychange',hidden);player.current?.dispose();player.current=null;if(flashTimer.current)clearTimeout(flashTimer.current);};
  },[story.id,last]);
  useEffect(()=>{
    if(narrative){player.current?.load(recording.src);if(autoNext.current){autoNext.current=false;void play();}}
    else player.current?.pause();
  },[page,recording.src]);
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
    for(const next of [page-1,page+1]) if(next>1&&next<last){
      const image=new Image();image.src=story.art[next-2].image;
    }
  },[page,story]);
  function renderPage(frame:number){
    if(frame===0)return <article className="adam-page adam-cover" aria-label={story.coverName}>
      <img src={story.cover} alt={`${story.title}, ${story.subtitle}`} draggable={false}/>
      <CoverText story={story}/>
    </article>;
    if(frame===1)return <article className="adam-page reading-title-page" data-book={story.id} aria-label={story.title}>
      <div className="reading-title-content">
        <h1><span>{story.coverName}</span><span>пайхмарах<br/>лаьцна дийцар</span></h1>
        <p>{story.subtitle}</p>
      </div>
    </article>;
    if(frame===last)return <article className="adam-page adam-sources">
      <div className="adam-source-content">
        <h2>Хьосташ</h2>
        {story.sourceGroups.map(group=><section className="adam-source-group" key={group.name} aria-label={group.name}>
          <h3>{group.name}</h3>
          <ol>{group.entries.map(source=><li key={`${source.name}-${source.reference}`}>
            {source.name&&<span className="adam-source-name">{source.name}</span>}
            <span className="adam-source-reference">{source.reference}</span>
          </li>)}</ol>
        </section>)}
      </div>
    </article>;
    const index=frame-1;
    return <article className={`adam-page adam-narrative copy-${story.art[index-1].edge}`} aria-label={`${index} / ${story.paragraphs.length}`}>
      <img src={story.art[index-1].image} alt="" draggable={false}/>
      {story.art[index-1].image.includes('-edition-')
        ? <div className="story-scene-copy" data-edge={story.art[index-1].edge}>{story.paragraphs[index-1].map(text=><p key={text}>{text}</p>)}</div>
        : story.id==='salih' && story.art[index-1].image.includes('-relief-')
        ? <div className="salih-scene-copy" data-page={index} data-layout={story.art[index-1].image.includes('-open-')?'open':undefined}>{story.paragraphs[index-1].map(text=><p key={text}>{text}</p>)}</div>
        : <div className="adam-wash"><div className="adam-copy">{story.paragraphs[index-1].map(text=><p key={text}>{text}</p>)}</div></div>}
    </article>;
  }
  return <main className={`adam-reader story-${story.id}`}>
    <div className="adam-toolbar"><button onClick={onBack} aria-label="Деша"><AppIcon name="arrow-left"/></button><span>Деша</span>
      {page!==last&&<div className="story-listen-controls">
        {recording.demo&&<small>Тест аудио</small>}
        <button onClick={toggleAudio} aria-label={audioStatus==='playing'?'Пауза':audioStatus==='loading'?'Остановить загрузку':'Слушать рассказ'} aria-pressed={audioStatus==='playing'}><AppIcon name={audioStatus==='playing'||audioStatus==='loading'?'pause':'play'}/></button>
      </div>}
    </div>
    {audioStatus==='error'&&<div className="story-audio-error" role="status">Аудио не загрузилось. Нажми ▶ ещё раз.</div>}
    <div className="story-audio-stage">
    <BookPageTurn ref={book} index={page} lastIndex={last} renderPage={renderPage} onStart={()=>{}}
      tapAnywhere onCenterTap={narrative?toggleAudio:undefined}
      onTurnStart={()=>{turning.current=true;resumeAfterCancel.current=player.current?.status==='playing';player.current?.pause();setFeedback(null);}}
      onFinish={next=>{turning.current=false;const resume=resumeAfterCancel.current;resumeAfterCancel.current=false;if(next!==null)setPage(next);else if(resume)void player.current?.play();}}/>
    {feedback&&<span key={feedback.key} className="story-audio-flash" aria-hidden="true"><AppIcon name={feedback.icon}/></span>}
    </div>
    <nav className="adam-navigation" aria-label="АгӀонаш">
      <button disabled={page===0} onClick={()=>book.current?.turnTo(page-1)} aria-label="Хьалхара"><AppIcon name="arrow-left"/></button>
      <span aria-live="polite">{page<2?"Деша":page===last?"Хьосташ":`${page-1} / ${story.paragraphs.length}`}</span>
      <button disabled={page===last} onClick={()=>book.current?.turnTo(page+1)} aria-label="РогӀера"><AppIcon name="arrow-right"/></button>
    </nav>
  </main>;
}

export default function ReadingLibrary({onBack}:{onBack:()=>void}){
  const [section,setSection]=useState('all');
  const [query,setQuery]=useState('');
  const [open,setOpen]=useState<ReadingBook|null>(null);
  const filtered:ReadingBook[]=filterReadingBooks(readingBooks,section,query);
  if(open)return <StoryBook key={open.id} story={open} onBack={()=>setOpen(null)}/>;
  return <main className="reading-library">
    <header><button onClick={onBack} aria-label="Коьртачу агӀор"><AppIcon name="arrow-left"/></button><h1>Деша</h1></header>
    <div className="reading-controls">
      <div className="reading-search">
        <input id="reading-search" type="search" aria-label="цӀе чуйазде" value={query} onChange={event=>setQuery(event.target.value)} placeholder="цӀе чуйазде" autoComplete="off"/>
        {query&&<button className="reading-search-clear" onClick={()=>setQuery('')} aria-label="Очистить поиск">×</button>}
      </div>
      <div className="reading-sections" role="group" aria-label="Категории рассказов">
        {readingSections.map(({id,label})=><button key={id} aria-pressed={section===id} onClick={()=>setSection(id)}>{label}<small>{filterReadingBooks(readingBooks,id,'').length}</small></button>)}
      </div>
    </div>
    {filtered.length?<section className="reading-shelf" aria-label="Деша">{filtered.map(story=><button className="adam-library-cover" key={story.id} onClick={()=>setOpen(story)} aria-label={story.title}>
      <div className="reading-cover-art">
        <img src={story.cover} alt={`${story.title}, ${story.subtitle}`}/>
        <CoverText story={story}/>
      </div>
      <span><AppIcon name="book"/> Деша</span>
    </button>)}</section>:<div className="reading-empty" role="status"><AppIcon name="book"/><p>{query?'0':'Кестта'}</p>{query&&<button onClick={()=>{setQuery('');setSection('all');}}>Дерриге</button>}</div>}
  </main>;
}
