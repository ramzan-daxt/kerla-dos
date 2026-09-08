import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {adamParagraphs,adamSources,adamTitle} from '../app/adam-story.mjs';
import {adamArt} from '../app/adam-art.mjs';
test('each revised scene has its own art and an explicit copy edge',()=>{
  assert.equal(adamArt.length,adamParagraphs.length);
  assert.equal(new Set(adamArt.map(item=>item.image)).size,8);
  assert.deepEqual(new Set(adamArt.map(item=>item.edge)),new Set(['top','bottom']));
  for(const art of adamArt){
    assert.ok(existsSync(new URL(`../public${art.image}`,import.meta.url)));
  }
});
test('Adam book has eight pages and complete source coverage',()=>{
  assert.equal(adamParagraphs.length,8);
  assert.equal(adamTitle,'Адам пайхмарах лаьцна дийцар');
  assert.equal(adamParagraphs[0][0],'АллахӀа Адам кхоьллина. Адам ву дерриге адамийн да.');
  assert.equal(adamParagraphs[7][0],'АллахӀа Адаман тоба тӀеийцир.');
  for(let i=1;i<=8;i++){
    assert.ok(existsSync(new URL(`../public/stories/adam/page-${i}.png`,import.meta.url)));
    assert.ok(adamSources.some(source=>source.pages.includes(i)));
  }
  assert.ok(existsSync(new URL('../public/stories/adam/cover-v1.png',import.meta.url)));
});
test('requested arrogance and deception additions preserve original text and cite their source',()=>{
  assert.equal(adamParagraphs[2][0],'АллахӀа Адам латтах кхоьллина. Цунна хӀуманийн цӀераш а Ӏамийна.');
  assert.match(adamParagraphs[2][1],/Иблисо.*куралла/);
  assert.equal(adamParagraphs[5][1],'ШайтӀано уьш Ӏехийна. Цара стоьмаш биийра.');
  assert.ok(adamSources.some(s=>s.label==='Къуръан · 7:12–17'&&s.pages.includes(3)&&s.pages.includes(6)));
});
test('Adam reader uses real text, final sources and no unsupported synthesized narration',()=>{
  const source=readFileSync(new URL('../app/reading-library.tsx',import.meta.url),'utf8');
  assert.ok(source.includes('adamParagraphs[index-1].map'));
  assert.ok(source.includes('index===last'));
  assert.ok(source.includes('<BookPageTurn'));
  assert.ok(!source.includes('speechSynthesis'));
  assert.ok(!source.includes('FullStory'));
});
