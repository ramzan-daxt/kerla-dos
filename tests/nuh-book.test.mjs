import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {nuhBook,nuhParagraphs,nuhSources,nuhArt,nuhBeats} from '../app/nuh-story.mjs';
import {readingBooks,adamBook} from '../app/reading-books.mjs';
import {adamParagraphs} from '../app/adam-story.mjs';
import {normalizeChechen} from '../app/chechen-orthography.mjs';

test('owner corrections preserve Nuh soft sign and revised water and wave wording',()=>{
  assert.equal(nuhBook.coverName,'Нухь');
  const visible=[nuhBook.title,nuhBook.coverName,...nuhParagraphs.flat(),...nuhSources.map(s=>s.name)].join(' ');
  assert.ok(!/Нух(?!ь)/u.test(visible));
  assert.equal(nuhParagraphs[4][0],'Стиглара чӀогӀа догӀа доладелира. Латтара а хиш схьаладелийра. Хи совдала доладелира.');
  assert.ok(nuhParagraphs[5][0].startsWith('Кема даккхий тулгӀенаш йуккъехьула доьдуш дара.'));
});

test('Nuh is a separate book and Adam retains his complete text',()=>{
  assert.deepEqual(readingBooks.map(book=>book.id),['adam','nuh','hud','salih']);
  assert.equal(adamBook.paragraphs,adamParagraphs);
  assert.equal(nuhBook.subtitle,'Делера салам хуьлда цунна');
  assert.equal(nuhBook.coverText,true);
});
test('eight illustrated pages cover all six story beats and have sources',()=>{
  assert.equal(nuhParagraphs.length,8);
  assert.equal(nuhArt.length,8);
  assert.deepEqual([...new Set(nuhBeats)],['setup','intrigue','development','climax','resolution','lesson']);
  assert.equal(new Set(nuhArt.map(art=>art.image)).size,8);
  for(let index=0;index<8;index++){
    assert.ok(nuhSources.some(source=>source.pages.includes(index+1)));
    assert.ok(['top','bottom'].includes(nuhArt[index].edge));
    assert.ok(existsSync(new URL(`../public${nuhArt[index].image}`,import.meta.url)));
    const text=nuhParagraphs[index].join(' ');
    assert.equal(text,normalizeChechen(text));
    assert.ok(text.length<200,'Approved consequence and final lesson remain brief');
  }
  assert.ok(existsSync(new URL(`../public${nuhBook.cover}`,import.meta.url)));
});
test('reader selection, cover text, pagination and sources are book-specific',()=>{
  const source=readFileSync(new URL('../app/reading-library.tsx',import.meta.url),'utf8');
  assert.ok(source.includes('key={open.id} story={open}'));
  assert.ok(source.includes('story.paragraphs.length+2'));
  assert.ok(source.includes('story.sourceGroups.map'));
  assert.ok(source.includes('<CoverText story={story}/>'));
  assert.ok(!source.includes(' / 8'));
  assert.ok(!source.includes('speechSynthesis'));
  assert.ok(!source.includes('href={source.url}'));
});
