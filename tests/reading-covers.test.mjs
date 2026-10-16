import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {readingBooks} from '../app/reading-books.mjs';

test('all covers have editable lettering on a common vertical grid',()=>{
  for(const book of readingBooks){
    assert.equal(book.coverText,true);
    assert.equal(book.cover,`/stories/${book.id}/cover-clean-${['adam','nuh'].includes(book.id)?'v3':'v2'}.png`);
    assert.equal(book.subtitle,'Делера салам хуьлда цунна');
  }
  const css=readFileSync(new URL('../app/adam-book.css',import.meta.url),'utf8');
  assert.ok(css.includes('.reading-cover-text[data-book]{top:23%;left:7%;right:7%'));
  assert.ok(!css.includes('.reading-cover-text[data-book="hud"]{left:'));
  assert.ok(css.includes('clamp(42px,19cqw,108px)'));
  assert.ok(!css.includes('.reading-cover-text[data-book]::before'));
  const reader=readFileSync(new URL('../app/reading-library.tsx',import.meta.url),'utf8');
  assert.ok(reader.includes('пайхмарах<br/>лаьцна дийцар'));
  const cover=reader.slice(reader.indexOf('function CoverText'),reader.indexOf('function StoryBook'));
  assert.ok(!cover.includes('<p'));
  assert.ok(reader.includes('className="adam-page reading-title-page"'));
  assert.ok(reader.includes('<p>{story.subtitle}</p>'));
  assert.ok(reader.includes('const last=story.paragraphs.length+2'));
  assert.ok(reader.includes('const index=frame-1'));
  assert.ok(reader.includes('story.art[next-2].image'));
});

test('other narrative washes preserve their opacity and text contrast',()=>{
  const css=readFileSync(new URL('../app/adam-book.css',import.meta.url),'utf8');
  assert.ok(css.includes('opacity:.83'));
  assert.ok(css.includes('.adam-wash::before'));
});
