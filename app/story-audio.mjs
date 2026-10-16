// Page numbers are narrative numbers (cover and sources are not recordings).
// Replace individual entries with the owner's recordings; missing entries use
// the explicitly labelled controls demo, never synthesized Chechen narration.
export const storyRecordings = {adam:{},nuh:{},hud:{},salih:{}};
export function storyRecording(id,page){
  const src=storyRecordings[id]?.[page];
  return {src:src||'/audio/story-demo/controls.wav',demo:!src};
}

export function createStoryAudio(audio,notify,onEnded){
  let epoch=0,status='idle',disposed=false;
  const update=value=>{status=value;if(!disposed)notify(value);};
  const ended=()=>{if(status==='playing'){update('ended');onEnded();}};
  const error=()=>{if(status==='playing'||status==='loading'){epoch++;update('error');}};
  audio.addEventListener('ended',ended);
  audio.addEventListener('error',error);
  return {
    get status(){return status;},
    load(src){epoch++;audio.pause();audio.src=src;audio.load();update('idle');},
    async play(){
      const request=++epoch;
      if(status==='ended')audio.currentTime=0;
      update('loading');
      try{await audio.play();if(!disposed&&request===epoch){update('playing');return true;}}
      catch{if(!disposed&&request===epoch)update('error');}
      return false;
    },
    pause(){epoch++;audio.pause();update('paused');},
    dispose(){disposed=true;epoch++;audio.pause();audio.removeEventListener('ended',ended);audio.removeEventListener('error',error);audio.removeAttribute('src');audio.load();},
  };
}
