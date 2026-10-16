"use client";
import {forwardRef,useImperativeHandle,useRef,useState,useEffect,type ReactNode,type PointerEvent} from "react";

export type BookTurnHandle={turnTo:(page:number)=>void};
type Turn={target:number;direction:1|-1;progress:number};
type Gesture={id:number;x:number;y:number;width:number;dragged:boolean};
type Props={index:number;lastIndex:number;renderPage:(index:number)=>ReactNode;onStart:()=>void;onFinish:(target:number|null)=>void;onCenterTap?:()=>void;tapAnywhere?:boolean;onTurnStart?:()=>void};

// Both page faces stay mounted until release completes. No text swap mid-turn.
export default forwardRef<BookTurnHandle,Props>(function BookPageTurn({index,lastIndex,renderPage,onStart,onFinish,onCenterTap,tapAnywhere=false,onTurnStart},ref){
  const [turn,setTurn]=useState<Turn|null>(null);
  const current=useRef<Turn|null>(null);
  const gesture=useRef<Gesture|null>(null);
  const frame=useRef<number|null>(null);
  const settling=useRef(false);
  const holding=useRef(false);
  const callbacks=useRef({onStart,onFinish});
  callbacks.current={onStart,onFinish};
  function update(value:Turn|null){current.current=value;setTurn(value);}
  function startHold(){if(!holding.current){holding.current=true;callbacks.current.onStart();}}
  function releaseHold(){if(holding.current){holding.current=false;callbacks.current.onFinish(null);}}
  function begin(target:number){
    if(current.current||target<0||target>lastIndex||target===index)return false;
    update({target,direction:target>index?1:-1,progress:0});
    onTurnStart?.();
    startHold();
    return true;
  }
  function finish(commit:boolean){
    const active=current.current;
    if(!active)return;
    frame.current=null;settling.current=false;gesture.current=null;
    update(null);
    holding.current=false;
    callbacks.current.onFinish(commit?active.target:null);
  }
  function settle(commit:boolean){
    if(!current.current||settling.current)return;
    settling.current=true;
    const start=current.current.progress,end=commit?1:0;
    const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches||document.body.classList.contains("reduce-motion");
    if(reduced){finish(commit);return;}
    const duration=180+Math.abs(end-start)*300;
    let started:number|undefined;
    function tick(now:number){
      if(!current.current)return;
      started??=now;
      const time=Math.min(1,(now-started)/duration);
      const eased=1-Math.pow(1-time,3);
      update({...current.current,progress:start+(end-start)*eased});
      if(time<1)frame.current=requestAnimationFrame(tick);else finish(commit);
    }
    frame.current=requestAnimationFrame(tick);
  }
  useImperativeHandle(ref,()=>({turnTo(target){if(begin(target))settle(true);}}));
  useEffect(()=>()=>{if(frame.current!==null)cancelAnimationFrame(frame.current);},[]);
  useEffect(()=>{
    const cancel=()=>{
      if(!current.current){gesture.current=null;releaseHold();return;}
      if(frame.current!==null)cancelAnimationFrame(frame.current);
      finish(false);
    };
    const hidden=()=>{if(document.hidden)cancel();};
    window.addEventListener("resize",cancel);
    window.addEventListener("blur",cancel);
    document.addEventListener("visibilitychange",hidden);
    return()=>{window.removeEventListener("resize",cancel);window.removeEventListener("blur",cancel);document.removeEventListener("visibilitychange",hidden);};
  },[]);
  function down(event:PointerEvent<HTMLDivElement>){
    if(!event.isPrimary||event.button!==0||settling.current||current.current)return;
    if((event.target as HTMLElement).closest("button,a,input"))return;
    const rect=event.currentTarget.getBoundingClientRect();
    gesture.current={id:event.pointerId,x:event.clientX,y:event.clientY,width:rect.width,dragged:false};
    startHold();
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function move(event:PointerEvent<HTMLDivElement>){
    const g=gesture.current;if(!g||g.id!==event.pointerId||settling.current)return;
    const dx=event.clientX-g.x,dy=event.clientY-g.y;
    if(!g.dragged){
      if(Math.abs(dy)>10&&Math.abs(dy)>Math.abs(dx)){gesture.current=null;releaseHold();return;}
      if(Math.abs(dx)<8)return;
      g.dragged=true;
      if(!begin(index+(dx<0?1:-1)))return;
    }
    const active=current.current;if(!active)return;
    update({...active,progress:Math.max(0,Math.min(1,-dx*active.direction/g.width))});
  }
  function up(event:PointerEvent<HTMLDivElement>){
    const g=gesture.current;if(!g||g.id!==event.pointerId)return;
    gesture.current=null;
    if(current.current){settle(current.current.progress>=.35);return;}
    if(g.dragged){releaseHold();return;}
    const rect=event.currentTarget.getBoundingClientRect();
    const relative=(event.clientX-rect.left)/rect.width;
    if(onCenterTap&&(tapAnywhere||(relative>.23&&relative<.77))){releaseHold();onCenterTap();return;}
    if(begin(index+(event.clientX<rect.left+rect.width/2?-1:1)))settle(true);else releaseHold();
  }
  function cancel(){gesture.current=null;if(current.current&&!settling.current)settle(false);else if(!current.current)releaseHold();}
  const p=turn?.progress??0;
  const forward=turn?.direction!==-1;
  const crease=forward?100*(1-p):100*p;
  const frontClip=forward?`inset(0 ${p*100}% 0 0)`:`inset(0 0 0 ${p*100}%)`;
  const foldLeft=forward?100*(1-2*p):100*p;
  return <div className={`book-turn-shell ${turn?"is-turning":""}`} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={cancel} onLostPointerCapture={cancel}>
    {turn&&<div className="book-turn-under" aria-hidden="true" inert>{renderPage(turn.target)}</div>}
    <div className="book-turn-front" style={{clipPath:turn?frontClip:undefined,WebkitClipPath:turn?frontClip:undefined}}>{renderPage(index)}</div>
    {turn&&p>0&&p<1&&<>
      <div className="book-fold-shadow" style={{left:`${crease}%`,opacity:Math.sin(p*Math.PI)*.3,transform:"translateX(-50%)"}} aria-hidden="true"/>
      <div className={`book-fold-back ${forward?"fold-next":"fold-previous"}`} style={{left:`${foldLeft}%`,width:`${p*100}%`}} aria-hidden="true">
        <div className="book-fold-grain"/>
      </div>
    </>}
  </div>;
});
