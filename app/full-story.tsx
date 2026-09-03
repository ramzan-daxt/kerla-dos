"use client";
import {useEffect,useRef,useState} from"react";
import AppIcon from "./ui-icon";
type Block={speaker:string;text:string};type Scene={title:string;image:string;blocks:Block[]};
const scenes:Scene[]=[
{title:"Нацкъарш жа юккъера дӀабаьлла",image:"/stories/borz-ka/scene-01.png",blocks:[{speaker:"Кхочушверг",text:"Жа юккъера нацкъар а баьлла, уьдуш, ловзуш хилла цхьа-ши lахар. Жа гена даьлча, уьш тергалдеш lаш йолчу борзо кхерабина. Цул тlаьхьа хьун луьста йолчу дlатаlа йоьдуш хилла борз."}]},
{title:"Борз а, къена ка а",image:"/stories/borz-ka/scene-02.png",blocks:[{speaker:"Кхочушверг",text:"Хьуьнан йистехь, бай тlехь бежаш цхьа къена ка гина цунна. Цунна тlе а яхана, барзо аьлла:"},{speaker:"Борз",text:"Хе-е-е, ка, хlара бай сан буйла ца хаьа хьуна? Кхузахь бажа бакъо хьан елла хьуна?"},{speaker:"Ка",text:"Хlара бай хьан бац, сан жаlун бу, — меллаша жоп делира кано."}]},
{title:"Бай хьенан бу?",image:"/stories/borz-ka/scene-03.png",blocks:[{speaker:"Борз",text:"Хьо харц лоь! Хьан жаlу дуьнен тlе а валаза вара, хlара бай сан долахь болуш."},{speaker:"Ка",text:"И бакъ дац. Суна дика хаьа хlара бай сан жаlун буй!"},{speaker:"Кхочушверг",text:"Оьгlазъяхара борз, амма ша юьзина йолу дела, канна хlума ца дира. Кхана юха ер ю, аьлла, сацам бира цо."}]},
{title:"Дуьй бааран къамел",image:"/stories/borz-ka/scene-04.png",blocks:[{speaker:"Борз",text:"Кхана lуьйранна кхуззахь вовшах кхетар ду. Коьллашна уллохь бай шен бу, аьлла, дуй биинчуьннан хир бу-кх и. Реза буй хьо?"},{speaker:"Ка",text:"Реза бу, — меллаша жоп делира кано."},{speaker:"Кхочушверг",text:"Тlаккха и шиъ дlасакъаьстира: борз хьуьнах яхара, ткъа ка шен эвла дlаяхара."}]},
{title:"Кан кхетаме гlуллакх",image:"/stories/borz-ka/scene-05.png",blocks:[{speaker:"Кхочушверг",text:"Сатосуш, шеца доккха жан-жlаьла а далош, схьабеъна ка. Жlаьла коьллаш юкъа дlалечкъина, ткъа ка кхуззахь бажа хlоттина."},{speaker:"Борз",text:"Хlинца-м дийнна кlиранах юьзина лелар яра со, — аьлла, бай тlе едда борз."}]},
{title:"Цхьогал дуьхьалъяла",image:"/stories/borz-ka/scene-06.png",blocks:[{speaker:"Цхьогал",text:"Марша йогlийла, борз! Хьо стенга йоьду сел сихъелла?"},{speaker:"Борз",text:"Маршалла хуьлда, цхьогал. Со-м бай болчу йоьдура, — аьлла, ма дарра дlадийцина барзо, ша каца къовсарх лаьцна."}]},
{title:"Цхьогал теш хила лаьа",image:"/stories/borz-ka/scene-07.png",blocks:[{speaker:"Цхьогал",text:"Теш ца хилча цхьа а къийсам чекх ца болу. Со теш дигахь, со хьоьгахьа хир ду."},{speaker:"Борз",text:"И дан мегар долуш хlума ду, схьадола соьца."},{speaker:"Кхочушверг",text:"Борззий, цхьогалий бай болчу кхаьчна."}]},
{title:"Цхьогалан харц къамел",image:"/stories/borz-ka/scene-08.png",blocks:[{speaker:"Борз",text:"Хlинца а хьайн жаlун бу боху ахьа хlара бай?!"},{speaker:"Ка",text:"Дера боху."},{speaker:"Цхьогал",text:"Э-э-э, ка, эхь ца хета хьуна! Массарна а хууш ма ду хlара бай берзан буй. Сан дас-нанас а кест-кеста къамел дора кху байх лаьцна."}]},
{title:"Цхьогал коьллашна тӀейола",image:"/stories/borz-ka/scene-09.png",blocks:[{speaker:"Ка",text:"Дика ду делахь! Дуй буий ахьа, айхьа дуьйцург бакъ ду, аьлла? Стань ког коьллаш юккъе."},{speaker:"Кхочушверг",text:"Цхьогална коьллаш юккъера жlаьлин суьрта тlехь хlума гина. Тlаккха сихха юха а йирзина."},{speaker:"Цхьогал",text:"Билггал ала ца хаьа суна, хlара бай хьенан бу. Нагахь барзо дуй баахь, аса а буур бу-кх."}]},
{title:"Барзо дуй буу",image:"/stories/borz-ka/scene-10.png",blocks:[{speaker:"Борз",text:"Хьо санна кхоьруш яц со, аса буур бу дуй!"},{speaker:"Кхочушверг",text:"Барзо «ас дуй буу» оллушехь, коьллаш юкъера доккха жан-жlаьла схьаиккхира. Борз кхераелла, сихха хьуьнга едда дlаяхара."}]},
{title:"Харц дуьйнах хуьлучуьнан чаккхе",image:"/stories/borz-ka/scene-11.png",blocks:[{speaker:"Кхочушверг",text:"Борз кlелхьараелира. Ткъа цхьогал лекхачу гу тlе а даьлла, цигара барзе мохь бетташ дара:"},{speaker:"Цхьогал",text:"Аса ца бехира хьоьга, борз, къера дуй ма баа?! Ла ца дуьйгlира ахьа соьга, цундела хьуна хила деззарг хили-кх!"}]}
];
const cls:Record<string,string>={"Кхочушверг":"narrator","Борз":"wolf","Ка":"ram","Цхьогал":"fox"};
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
  const [turning,setTurning]=useState<"next"|"previous"|null>(null);
  const [rating,setRating]=useState(0);
  const cursor=useRef([0,0]);
  const touchX=useRef<number|null>(null);
  const scene=scenes[si];

  useEffect(()=>()=>speechSynthesis.cancel(),[]);
  useEffect(()=>{
    const saved=window.localStorage.getItem("kerla-dos-story-ratings");
    if(!saved)return;
    try{setRating(Number(JSON.parse(saved)["borz-ka"])||0)}catch{}
  },[]);
  useEffect(()=>{
    if(mode!=="read") return;
    const onKey=(event:KeyboardEvent)=>{
      if(event.key==="ArrowRight") turn(si+1);
      if(event.key==="ArrowLeft") turn(si-1);
      if(event.key==="Escape") setMode("cover");
    };
    window.addEventListener("keydown",onKey);
    return()=>window.removeEventListener("keydown",onKey);
  },[mode,si,turning]);

  function speak(s:number,b:number){
    const block=scenes[s]?.blocks[b];
    if(!block){
      if(s<scenes.length-1){setSi(s+1);setBi(0);cursor.current=[s+1,0];speak(s+1,0)}
      else{setState("idle");setMode("end")}
      return;
    }
    setSi(s);setBi(b);cursor.current=[s,b];
    const u=new SpeechSynthesisUtterance(block.text);
    u.lang="ru-RU";u.rate=rate;u.volume=volume;
    u.onend=()=>{if(cursor.current[0]===s&&cursor.current[1]===b)speak(s,b+1)};
    u.onerror=()=>setState("idle");
    speechSynthesis.speak(u);
  }

  function toggle(){
    if(state==="playing"){speechSynthesis.pause();setState("paused")}
    else if(state==="paused"){speechSynthesis.resume();setState("playing")}
    else{speechSynthesis.cancel();setState("playing");speak(si,bi)}
  }

  function go(n:number){
    if(n<0||n>=scenes.length)return;
    speechSynthesis.cancel();setState("idle");setSi(n);setBi(0);cursor.current=[n,0];
  }

  function turn(n:number){
    if(turning||n<0)return;
    if(n>=scenes.length){
      setTurning("next");
      window.setTimeout(()=>setMode("end"),360);
      window.setTimeout(()=>setTurning(null),720);
      return;
    }
    const direction=n>si?"next":"previous";
    setTurning(direction);
    window.setTimeout(()=>go(n),360);
    window.setTimeout(()=>setTurning(null),720);
  }

  function leaveBook(){
    speechSynthesis.cancel();setState("idle");setMode("cover");
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
          <button className="icon-label" onClick={()=>setMode("listen")}><AppIcon name="play"/> Хаза</button>
        </div>
      </div>
    </article>
  </main>;

  if(mode==="end") return <main className="extra-shell full-tale tale-end-screen">
    <button className="book-exit" onClick={()=>setMode("cover")} aria-label="Обложка"><AppIcon name="arrow-left"/></button>
    <section className="tale-ending">
      <div className="ending-message">
        <small>ТУЬЙРА ЧЕКХЪЯЬЛЛА</small>
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
        {rating>0&&<p className="rating-thanks">Баркалла! Юкъара мах — <strong>{currentAverage} ★</strong> · рейтингехь {currentRank}-гӀа</p>}
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

  return <main className={`extra-shell full-tale ${mode==="read"?"reading-mode":"listening-mode"}`}>
    <button className="book-exit" onClick={leaveBook} aria-label="Обложка"><AppIcon name="arrow-left"/></button>
    {mode==="listen"&&<span className="story-progress">{si+1} / {scenes.length}</span>}
    <article
      className={`tale-stage ${turning?`page-turn page-turn-${turning}`:""}`}
      onClick={mode==="read"?(event)=>{
        const target=event.target as HTMLElement;
        if(target.closest("button"))return;
        const box=event.currentTarget.getBoundingClientRect();
        turn(event.clientX<box.left+box.width/2?si-1:si+1);
      }:undefined}
      onTouchStart={mode==="read"?(event)=>{touchX.current=event.touches[0].clientX}:undefined}
      onTouchEnd={mode==="read"?(event)=>{
        if(touchX.current===null)return;
        const delta=event.changedTouches[0].clientX-touchX.current;
        touchX.current=null;
        if(Math.abs(delta)>45)turn(delta<0?si+1:si-1);
      }:undefined}
    >
      <div className="tale-image"><img src={scene.image} alt=""/></div>
      <div className="tale-copy">
        <small>БОРЗ А, КЪЕНА КА А</small>
        <h1>{scene.title}</h1>
        <div className="tale-blocks">{scene.blocks.map((b,i)=><p key={i} className={`${cls[b.speaker]} ${i===bi&&state!=="idle"?"reading":""}`}><b>{b.speaker}</b><span>{b.text}</span></p>)}</div>
        {mode==="listen"&&<div className="tale-controls">
          <button onClick={()=>turn(si-1)} disabled={!si} aria-label="Хьалхара"><AppIcon name="arrow-left"/></button>
          <button className="tale-play icon-label" onClick={toggle}><AppIcon name={state==="playing"?"pause":"play"}/>{state==="playing"?"Соцаде":state==="paused"?"ДӀахӀоттаде":"Туьйра хаза"}</button>
          <button onClick={()=>turn(si+1)} aria-label={si===scenes.length-1?"Чекхъяккха":"РогӀера"}><AppIcon name={si===scenes.length-1?"check":"arrow-right"}/></button>
        </div>}
      </div>
    </article>
    {mode==="read"&&<span className="reading-page-count" aria-live="polite">{si+1} / {scenes.length}</span>}
  </main>;
}
