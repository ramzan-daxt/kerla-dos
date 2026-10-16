import test from 'node:test';
import assert from 'node:assert/strict';
import {readingBooks} from '../app/reading-books.mjs';
import {storyStructure} from '../app/story-structure.mjs';

test('all four stories follow the six owner-approved beats without UI instructions',()=>{
  for(const book of readingBooks){
    const map=storyStructure[book.id];
    assert.deepEqual(Object.keys(map),['setup','intrigue','development','climax','resolution','lesson']);
    for(const pages of Object.values(map)){
      assert.ok(pages.length);
      for(const page of pages) assert.ok(page>=1&&page<=book.paragraphs.length);
    }
    assert.equal(map.lesson.at(-1),book.paragraphs.length);
  }
});
test('approved consequences and child lessons are retained',()=>{
  const text=Object.fromEntries(readingBooks.map(b=>[b.id,b.paragraphs.flat().join(' ')]));
  assert.match(text.adam,/латтахь беха доладелира/);
  assert.match(text.adam,/ГӀалат даьлча, из тӀеэца/);
  assert.match(text.nuh,/берш хи чохь бевлира/);
  assert.match(text.nuh,/Вай а АллахӀана муьтӀахь хила деза/);
  assert.match(text.hud,/Церан цӀенош бен ца дисира/);
  assert.match(text.hud,/Куралла йан йиш йац/);
  assert.match(text.salih,/АллахӀан омра кхочушдан деза/);
});
