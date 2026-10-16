import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {hudBook,hudParagraphs,hudSources,hudArt,hudBeats} from '../app/hud-story.mjs';
import {normalizeChechen} from '../app/chechen-orthography.mjs';

test('Hud has six brief pages, six beats and explicit Quran source coverage',()=>{
  assert.equal(hudBook.id,'hud');
  assert.equal(hudBook.subtitle,'Делера салам хуьлда цунна');
  assert.equal(hudParagraphs.length,6);
  assert.equal(hudArt.length,6);
  assert.deepEqual([...new Set(hudBeats)],['setup','intrigue','development','climax','resolution','lesson']);
  for(let i=0;i<6;i++){
    const text=hudParagraphs[i].join(' ');
    assert.equal(text,normalizeChechen(text));
    assert.ok(text.length<150);
    assert.ok(hudSources.some(s=>s.pages.includes(i+1)));
    assert.ok(['top','bottom'].includes(hudArt[i].edge));
  }
  assert.ok(hudParagraphs[2][0].includes('куралалла'));
  assert.ok(hudParagraphs[5][0].includes('къинхетамца'));
});

test('Hud uses seven distinct local portrait assets and live cover type',()=>{
  const paths=[hudBook.cover,...hudArt.map(a=>a.image)];
  assert.equal(new Set(paths).size,7);
  assert.equal(hudBook.coverText,true);
  for(const path of paths){
    const file=new URL(`../public${path}`,import.meta.url);
    assert.ok(existsSync(file),path);
    const png=readFileSync(file);
    assert.equal(png.subarray(1,4).toString(),'PNG');
    const width=png.readUInt32BE(16),height=png.readUInt32BE(20);
    assert.ok(Math.abs(width/height-2/3)<.01,'Portrait art must fit without cropping');
  }
});
