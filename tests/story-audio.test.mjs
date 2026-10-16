import test from 'node:test';
import assert from 'node:assert/strict';
import {createStoryAudio,storyRecording} from '../app/story-audio.mjs';
class AudioMock extends EventTarget{
  currentTime=0;paused=true;src='';
  play(){this.paused=false;return this.pending||Promise.resolve();}
  pause(){this.paused=true;}
  load(){this.currentTime=0;}
  removeAttribute(){this.src='';}
}
test('pause preserves position, resume and replay work',async()=>{
  const audio=new AudioMock();let ends=0;
  const player=createStoryAudio(audio,()=>{},()=>ends++);
  player.load('one');await player.play();audio.currentTime=7;player.pause();
  assert.equal(audio.currentTime,7);await player.play();assert.equal(audio.currentTime,7);
  audio.dispatchEvent(new Event('ended'));assert.equal(ends,1);
  await player.play();assert.equal(audio.currentTime,0);player.dispose();assert.equal(audio.paused,true);
});
test('navigation invalidates pending playback and resets reused demo URL',async()=>{
  const audio=new AudioMock();let resolve;
  audio.pending=new Promise(r=>resolve=r);
  const player=createStoryAudio(audio,()=>{},()=>{});
  player.load('demo');const pending=player.play();player.pause();player.load('demo');resolve();
  assert.equal(await pending,false);assert.equal(player.status,'idle');assert.equal(audio.paused,true);
});
test('failed playback allows retry; disposed/paused audio never advances',async()=>{
  const audio=new AudioMock();let ends=0;const player=createStoryAudio(audio,()=>{},()=>ends++);
  audio.pending=Promise.reject(new Error('blocked'));assert.equal(await player.play(),false);assert.equal(player.status,'error');
  audio.pending=null;await player.play();player.pause();audio.dispatchEvent(new Event('ended'));assert.equal(ends,0);
  player.dispose();audio.dispatchEvent(new Event('ended'));assert.equal(ends,0);
});
test('unrecorded pages explicitly use demo audio',()=>{
  for(const id of ['adam','nuh','hud','salih'])assert.deepEqual(storyRecording(id,1),{src:'/audio/story-demo/controls.wav',demo:true});
});
