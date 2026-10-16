import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {nuhBook,nuhArt} from '../app/nuh-story.mjs';
import {hudBook,hudArt} from '../app/hud-story.mjs';

test('catalog uses the approved narrative cover revision',()=>{
  assert.equal(nuhBook.cover,'/stories/nuh/cover-clean-v3.png');
  assert.equal(hudBook.cover,'/stories/hud/cover-clean-v2.png');
});
test('rejected Nuh variants stay out of the reading catalog',()=>{
  for(const page of [1,2,8]) assert.ok(!nuhArt[page-1].image.includes('-edition-'));
});
test('accepted scenes retain portrait framing and recoverable originals',()=>{
  for(const [id,art,pages] of [
    ['nuh',nuhArt,[3,4,5,6,7]],
    ['hud',hudArt,[1,2,3,4,5,6]],
  ]){
    for(const page of pages){
      const entry=art[page-1];
      assert.equal(entry.image,`/stories/${id}/page-${page}-edition-v1.png`);
      assert.ok(['top','bottom'].includes(entry.edge));
      const png=readFileSync(new URL(`../public${entry.image}`,import.meta.url));
      assert.equal(png.subarray(1,4).toString(),'PNG');
      assert.ok(Math.abs(png.readUInt32BE(16)/png.readUInt32BE(20)-2/3)<.01);
      assert.ok(readFileSync(new URL(`../public/stories/${id}/page-${page}.png`,import.meta.url)).length>0);
    }
  }
});
