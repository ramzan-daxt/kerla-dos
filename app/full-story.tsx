"use client";
import {useEffect,useRef,useState} from"react";
import AppIcon from "./ui-icon";
import {storyTextParts} from "./story-typography.mjs";
import BookPageTurn,{type BookTurnHandle} from "./book-page-turn";
type Block={speaker:string;text:string};type Scene={title:string;image:string;blocks:Block[]};
const scenes:Scene[]=[
{title:"Нацкъарш жа йуккъера дӀабаьлла",image:"/stories/borz-ka/scene-01.png",blocks:[{speaker:"Кхочушверг",text:"Жа йуккъера нацкъар а баьлла, уьдуш, ловзуш хилла цхьа-ши lахар. Жа гена даьлча, уьш тергалдеш lаш йолчу борзо кхерабина. Цул тlаьхьа хьун луьста йолчу дlатаlа йоьдуш хилла борз."}]},
{title:"Борз а, къена ка а",image:"/stories/borz-ka/scene-02.png",blocks:[{speaker:"Кхочушверг",text:"Хьуьнан йистехь, бай тlехь бежаш цхьа къена ка гина цунна. Цунна тlе а йахана, барзо аьлла:"},{speaker:"Борз",text:"Хе-е-е, ка, хlара бай сан буйла ца хаьа хьуна? Кхузахь бажа бакъо хьан елла хьуна?"},{speaker:"Ка",text:"Хlара бай хьан бац, сан жаlун бу, — меллаша жоп делира кано."}]},
{title:"Бай хьенан бу?",image:"/stories/borz-ka/scene-03.png",blocks:[{speaker:"Борз",text:"Хьо харц лоь! Хьан жаlу дуьнен тlе а валаза вара, хlара бай сан долахь болуш."},{speaker:"Ка",text:"И бакъ дац. Суна дика хаьа хlара бай сан жаlун буй!"},{speaker:"Кхочушверг",text:"Оьгlазъйахара борз, амма ша йуьзина йолу дела, канна хlума ца дира. Кхана йуха ер йу, аьлла, сацам бира цо."}]},
{title:"Дуьй бааран къамел",image:"/stories/borz-ka/scene-04.png",blocks:[{speaker:"Борз",text:"Кхана lуьйранна кхуззахь вовшах кхетар ду. Коьллашна уллохь бай шен бу, аьлла, дуй биинчуьннан хир бу-кх и. Реза буй хьо?"},{speaker:"Ка",text:"Реза бу, — меллаша жоп делира кано."},{speaker:"Кхочушверг",text:"Тlаккха и шиъ дlасакъаьстира: борз хьуьнах йахара, ткъа ка шен эвла дlайахара."}]},
{title:"Кан кхетаме гlуллакх",image:"/stories/borz-ka/scene-05.png",blocks:[{speaker:"Кхочушверг",text:"Сатосуш, шеца доккха жан-жlаьла а далош, схьабеъна ка. Жlаьла коьллаш йукъа дlалечкъина, ткъа ка кхуззахь бажа хlоттина."},{speaker:"Борз",text:"Хlинца-м дийнна кlиранах йуьзина лелар йара со, — аьлла, бай тlе едда борз."}]},
{title:"Цхьогал дуьхьалъйала",image:"/stories/borz-ka/scene-06.png",blocks:[{speaker:"Цхьогал",text:"Марша йогlийла, борз! Хьо стенга йоьду сел сихъелла?"},{speaker:"Борз",text:"Маршалла хуьлда, цхьогал. Со-м бай болчу йоьдура, — аьлла, ма дарра дlадийцина барзо, ша каца къовсарх лаьцна."}]},
{title:"Цхьогал теш хила лаьа",image:"/stories/borz-ka/scene-07.png",blocks:[{speaker:"Цхьогал",text:"Теш ца хилча цхьа а къийсам чекх ца болу. Со теш дигахь, со хьоьгахьа хир ду."},{speaker:"Борз",text:"И дан мегар долуш хlума ду, схьадола соьца."},{speaker:"Кхочушверг",text:"Борззий, цхьогалий бай болчу кхаьчна."}]},
{title:"Цхьогалан харц къамел",image:"/stories/borz-ka/scene-08.png",blocks:[{speaker:"Борз",text:"Хlинца а хьайн жаlун бу боху ахьа хlара бай?!"},{speaker:"Ка",text:"Дера боху."},{speaker:"Цхьогал",text:"Э-э-э, ка, эхь ца хета хьуна! Массарна а хууш ма ду хlара бай берзан буй. Сан дас-нанас а кест-кеста къамел дора кху байх лаьцна."}]},
{title:"Цхьогал коьллашна тӀейола",image:"/stories/borz-ka/scene-09.png",blocks:[{speaker:"Ка",text:"Дика ду делахь! Дуй буий ахьа, айхьа дуьйцург бакъ ду, аьлла? Стань ког коьллаш йуккъе."},{speaker:"Кхочушверг",text:"Цхьогална коьллаш йуккъера жlаьлин суьрта тlехь хlума гина. Тlаккха сихха йуха а йирзина."},{speaker:"Цхьогал",text:"Билггал ала ца хаьа суна, хlара бай хьенан бу. Нагахь барзо дуй баахь, аса а буур бу-кх."}]},
{title:"Барзо дуй буу",image:"/stories/borz-ka/scene-10.png",blocks:[{speaker:"Борз",text:"Хьо санна кхоьруш йац со, аса буур бу дуй!"},{speaker:"Кхочушверг",text:"Барзо «ас дуй буу» оллушехь, коьллаш йукъера доккха жан-жlаьла схьаиккхира. Борз кхераелла, сихха хьуьнга едда дlайахара."}]},
{title:"Харц дуьйнах хуьлучуьнан чаккхе",image:"/stories/borz-ka/scene-11.png",blocks:[{speaker:"Кхочушверг",text:"Борз кlелхьараелира. Ткъа цхьогал лекхачу гу тlе а даьлла, цигара барзе мохь бетташ дара:"},{speaker:"Цхьогал",text:"Аса ца бехира хьоьга, борз, къера дуй ма баа?! Ла ца дуьйгlира ахьа соьга, цундела хьуна хила деззарг хили-кх!"}]}
];
// One shared wash per scene. The corresponding portrait has a quiet painted
// area at this edge; don't move these independently of the artwork.
const compositions=["top","top","bottom","bottom","top","bottom",
  "top","bottom","top","bottom","top"] as const;
function dialogue(block:Block){
  return storyTextParts(block).map((part:{kind:string;text:string},index:number)=>
    <span className={`story-${part.kind}`} key={index}>{part.text}</span>);
}
const otherStories=[
  {id:"fox-grapes",title:"Цхьогал а, кемсаш а",image:"/stories/borz-ka/scene-06.png",rating:4.8,votes:37},
  {id:"two-friends",title:"Ши доттагӀ",image:"/stories/borz-ka/scene-05.png",rating:4.6,votes:29},
  {id:"sun-cloud",title:"Малх а, морх а",image:"/stories/borz-ka/scene-01.png",rating:4.4,votes:21},
];
export default function FullStory({rate,volume,onBack}:{rate:number;volume:number;onBack:()=>void}) {
  const [si,setSi]=useState(0);
  const [bi,setBi]=useState(0);
  const [state,setState]=useState<"idle"|"playing"|"paused">("idle");
  const [mode,setMode]=useState<"cover"|"read"|"listen"|"end">("cover");
  const [rating,setRating]=useState(0);
  const [controls,setControls]=useState(true);
  const cursor=useRef([0,0]);
  const book=useRef<BookTurnHandle>(null);
  const audioEpoch=useRef(0);
  const beforeTurn=useRef<"idle"|"playing"|"paused">("idle");
  const turning=useRef(false);
  const audioState=useRef(state);
  const deferredSpeech=useRef<[number,number]|null>(null);
  audioState.current=state;

  useEffect(()=>()=>{audioEpoch.current++;window.speechSynthesis?.cancel();},[]);
  useEffect(()=>{
    try{const saved=Number(localStorage.getItem("kerla-dos-story-borz-ka-page"));if(Number.isInteger(saved)&&saved>=0&&saved<scenes.length){setSi(saved);cursor.current=[saved,0];}}catch{}
  },[]);
  useEffect(()=>{if(mode==="read"||mode==="listen")try{localStorage.setItem("kerla-dos-story-borz-ka-page",String(si));}catch{}},[si,mode]);
  useEffect(()=>{
    for(const page of [si-1,si+1])if(scenes[page]){
      const image=new Image();image.src=scenes[page].image.replace(".png","-portrait.webp");
    }
  },[si]);
  useEffect(()=>{
    const saved=window.localStorage.getItem("kerla-dos-story-ratings");
    if(!saved)return;
    try{setRating(Number(JSON.parse(saved)["borz-ka"])||0)}catch{}
  },[]);
  useEffect(()=>{
    if(mode!=="read"&&mode!=="listen") return;
    const onKey=(event:KeyboardEvent)=>{
      if(event.key==="ArrowRight"){event.preventDefault();turn(si+1);}
      if(event.key==="ArrowLeft"){event.preventDefault();turn(si-1);}
      if(event.key==="Escape") leaveBook();
      if(event.key===" "){event.preventDefault();setControls(value=>!value);}
    };
    window.addEventListener("keydown",onKey);
    return()=>window.removeEventListener("keydown",onKey);
  },[mode,si]);

  function speak(s:number,b:number){
    if(turning.current){deferredSpeech.current=[s,b];return;}
    const block=scenes[s]?.blocks[b];
    if(!block){
      turn(s+1);
      return;
    }
    setSi(s);setBi(b);cursor.current=[s,b];
    const u=new SpeechSynthesisUtterance(block.text);
    u.lang="ru-RU";u.rate=rate;u.volume=volume;
    const epoch=audioEpoch.current;
    u.onend=()=>{if(epoch===audioEpoch.current&&cursor.current[0]===s&&cursor.current[1]===b)speak(s,b+1)};
    u.onerror=()=>{if(epoch===audioEpoch.current)setState("idle");};
    speechSynthesis.speak(u);
  }

  function toggle(){
    if(turning.current)return;
    if(state==="playing"){speechSynthesis.pause();setState("paused")}
    else if(state==="paused"){speechSynthesis.resume();setState("playing")}
    else{audioEpoch.current++;speechSynthesis.cancel();setState("playing");speak(si,bi)}
  }

  function beginTurn(){
    turning.current=true;
    beforeTurn.current=audioState.current;
    if(audioState.current==="playing")speechSynthesis.pause();
  }
  function finishTurn(n:number|null){
    turning.current=false;
    if(n===null){
      if(beforeTurn.current==="playing"&&!document.hidden){
        speechSynthesis.resume();
        const pending=deferredSpeech.current;deferredSpeech.current=null;
        if(pending)speak(...pending);
      }
      else if(beforeTurn.current==="playing")setState("paused");
      return;
    }
    deferredSpeech.current=null;audioEpoch.current++;speechSynthesis.cancel();
    setBi(0);cursor.current=[n,0];
    if(n===scenes.length){setState("idle");setMode("end");return;}
    setSi(n);
    if(beforeTurn.current==="playing"&&mode==="listen"){
      speechSynthesis.resume();setState("playing");speak(n,0);
    }else setState("idle");
  }
  function turn(n:number){book.current?.turnTo(n);}

  function leaveBook(){
    deferredSpeech.current=null;audioEpoch.current++;speechSynthesis.cancel();turning.current=false;setState("idle");setMode("cover");
  }

  function rateStory(value:number){
    setRating(value);
    let saved:Record<string,number>={};
    try{saved=JSON.parse(window.localStorage.getItem("kerla-dos-story-ratings")||"{}")}catch{}
    saved["borz-ka"]=value;
    window.localStorage.setItem("kerla-dos-story-ratings",JSON.stringify(saved));
  }

  const currentAverage=Number(((44+rating)/(10+(rating?1:0))).toFixed(1));
  const ranking=[
    {id:"borz-ka",title:"Борз а, къена ка а",rating:currentAverage,votes:10+(rating?1:0)},
    ...otherStories.map(({id,title,rating,votes})=>({id,title,rating,votes})),
  ].sort((a,b)=>b.rating-a.rating);
  const currentRank=ranking.findIndex(item=>item.id==="borz-ka")+1;

  if(mode==="cover") return <main className="extra-shell full-tale tale-cover-screen">
    <button className="book-exit" onClick={onBack} aria-label="Туьйранаш"><AppIcon name="arrow-left"/></button>
    <article className="tale-cover">
      <img src="/stories/borz-ka/cover.png" alt="Борз а, къена ка а"/>
      <div className="tale-cover-copy">
        <small>ТУЬЙРА</small>
        <h1>Борз а, къена ка а</h1>
        <p>Автор: <strong>Хьамиди Зулай</strong></p>
        <div className="tale-cover-actions">
          <button className="icon-label" onClick={()=>setMode("read")}><AppIcon name="book"/> Деша</button>
          <button className="icon-label" onClick={()=>{setMode("listen");audioEpoch.current++;speechSynthesis.cancel();setState("playing");speak(si,0);}}><AppIcon name="play"/> Хаза</button>
        </div>
      </div>
    </article>
  </main>;

  if(mode==="end") return <main className="extra-shell full-tale tale-end-screen">
    <button className="book-exit" onClick={()=>setMode("cover")} aria-label="Обложка"><AppIcon name="arrow-left"/></button>
    <section className="tale-ending">
      <div className="ending-message">
        <small>ТУЬЙРА ЧЕКХЪЙАЬЛЛА</small>
        <h1>Хаза хилий хьуна?</h1>
        <p>Хьайн мах хадийта туьйрана</p>
        <div className="story-stars" role="radiogroup" aria-label="Туьйранан мах">
          {[1,2,3,4,5].map(value=><button
            key={value}
            className={value<=rating?"chosen":""}
            onClick={()=>rateStory(value)}
            role="radio"
            aria-checked={rating===value}
            aria-label={`${value} из 5`}
          ><AppIcon name="star"/></button>)}
        </div>
        {rating>0&&<p className="rating-thanks">Баркалла! Йукъара мах — <strong>{currentAverage} ★</strong> · рейтингехь {currentRank}-гӀа</p>}
      </div>

      <div className="story-ranking">
        <div className="ending-heading"><div><small>РЕЙТИНГ</small><h2>Дика мах йолу туьйранаш</h2></div></div>
        <ol>{ranking.map((story,index)=><li key={story.id} className={story.id==="borz-ka"?"current":""}>
          <span>{index+1}</span><strong>{story.title}</strong><em>{story.rating.toFixed(1)} ★</em><small>{story.votes} мах</small>
        </li>)}</ol>
      </div>

      <div className="other-stories">
        <div className="ending-heading"><div><small>КХИН А</small><h2>Кхин туьйра хьажа</h2></div></div>
        <div className="ending-story-grid">{otherStories.map(story=><article key={story.id}>
          <img src={story.image} alt=""/>
          <div><strong>{story.title}</strong><span>{story.rating.toFixed(1)} ★ · {story.votes} мах</span><small>Кестта</small></div>
        </article>)}</div>
      </div>
    </section>
  </main>;

  function renderPage(page:number){
    if(page===scenes.length)return <article className="tale-stage book-last-page"><div><small>ТУЬЙРА ЧЕКХЪЙАЬЛЛА</small><h1>Хаза хилий хьуна?</h1></div></article>;
    const scene=scenes[page];
    return <article className={`illustrated-page scene-${page+1} text-${compositions[page]}`} aria-label={`${page+1} / ${scenes.length}`}>
      <img className="story-art" src={scene.image.replace(".png","-portrait.webp")} alt="" draggable={false}/>
      <div className={`story-brush ${compositions[page]}`}>
        {scene.blocks.map((block,index)=><p key={index} className={`${block.speaker==="Кхочушверг"?"story-narration":"story-dialogue"} ${page===si&&index===bi&&state!=="idle"?"is-speaking":""}`}>{dialogue(block)}</p>)}
      </div>
    </article>;
  }
  return <main className={`extra-shell full-tale illustrated-reader ${mode==="read"?"reading-mode":"listening-mode"} ${controls?"":"controls-hidden"}`}>
    {controls&&<button className="book-exit" onClick={leaveBook} aria-label="Обложка"><AppIcon name="arrow-left"/></button>}
    <BookPageTurn ref={book} index={si} lastIndex={scenes.length} renderPage={renderPage} onStart={beginTurn} onFinish={finishTurn} onCenterTap={()=>setControls(value=>!value)}/>
    {mode==="listen"&&controls&&<div className="tale-controls book-listen-controls">
          <button onClick={()=>turn(si-1)} disabled={!si} aria-label="Хьалхара"><AppIcon name="arrow-left"/></button>
          <button className="tale-play icon-label" onClick={toggle}><AppIcon name={state==="playing"?"pause":"play"}/>{state==="playing"?"Соцаде":state==="paused"?"ДӀахӀоттаде":"Туьйра хаза"}</button>
          <button onClick={()=>turn(si+1)} aria-label={si===scenes.length-1?"Чекхъйаккха":"РогӀера"}><AppIcon name={si===scenes.length-1?"check":"arrow-right"}/></button>
    </div>}
    {controls&&<span className="reading-page-count" aria-live="polite">{si+1} / {scenes.length}</span>}
  </main>;
}
