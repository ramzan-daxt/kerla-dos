import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {salihBook,salihParagraphs,salihSources,salihArt,salihBeats} from '../app/salih-story.mjs';
import {normalizeChechen} from '../app/chechen-orthography.mjs';

test('Salih uses the owner-corrected Chechen name everywhere',()=>{
  assert.equal(salihBook.coverName,'Салихь');
  assert.equal(salihBook.title,'Салихь пайхмарах лаьцна дийцар');
  assert.doesNotMatch(salihParagraphs.flat().join(' '),/Салих(?!ь)/u);
});

test('Salih has seven brief pages, six story beats and source coverage',()=>{
  assert.equal(salihBook.id,'salih');
  assert.equal(salihBook.subtitle,'Делера салам хуьлда цунна');
  assert.equal(salihParagraphs.length,7);
  assert.equal(salihArt.length,7);
  assert.deepEqual([...new Set(salihBeats)],['setup','intrigue','development','climax','resolution','lesson']);
  for(let i=0;i<7;i++){
    const text=salihParagraphs[i].join(' ');
    assert.equal(text,normalizeChechen(text));
    assert.ok(text.length<220);
    assert.ok(salihSources.some(source=>source.pages.includes(i+1)));
    assert.ok(['top','bottom'].includes(salihArt[i].edge));
  }
  assert.ok(salihParagraphs[3][0].includes('Адамашна а шайн де'));
  assert.ok(salihParagraphs[6][0].includes('къинхетамца'));
});

test('Salih states warning, deliberate disobedience, death and rescue explicitly',()=>{
  assert.equal(salihArt[4].image,'/stories/salih/page-5-edition-v1.png');
  assert.ok(salihParagraphs[3].join(' ').includes('Цунна зе дича'));
  assert.ok(salihParagraphs[4].join(' ').includes('иман ца диллинчарна'));
  assert.ok(salihParagraphs[4].join(' ').includes('эмкал йийра'));
  assert.ok(salihParagraphs[4].join(' ').includes('кхо де'));
  assert.ok(salihParagraphs[5].join(' ').includes('шайн цӀеношкахь бевлира'));
  assert.ok(salihParagraphs[6].join(' ').includes('иман диллина берш'));
});

test('Salih has eight distinct accepted portrait assets',()=>{
  assert.equal(salihBook.coverText,true);
  const paths=[salihBook.cover,...salihArt.map(art=>art.image)];
  assert.equal(new Set(paths).size,8);
  for(const path of paths){
    const png=readFileSync(new URL(`../public${path}`,import.meta.url));
    assert.equal(png.subarray(1,4).toString(),'PNG');
    assert.ok(Math.abs(png.readUInt32BE(16)/png.readUInt32BE(20)-2/3)<.01);
  }
});

test('Salih follows Hud in the live reading catalog',async()=>{
  const {readingBooks}=await import('../app/reading-books.mjs');
  assert.equal(readingBooks.at(-1),salihBook);
  assert.equal(readingBooks.at(-2).id,'hud');
});

test('prophet stories retain the owner-selected subsection name',()=>{
  const source=readFileSync(new URL('../app/reading-filter.mjs',import.meta.url),'utf8');
  assert.ok(source.includes('Пайхмарашах лаьцна дийцарш'));
  assert.ok(!source.includes('"Сира"'));
});

test('Salih cover uses live text without a wash and revised ruins artwork',()=>{
  const reader=readFileSync(new URL('../app/reading-library.tsx',import.meta.url),'utf8');
  const css=readFileSync(new URL('../app/adam-book.css',import.meta.url),'utf8');
  assert.ok(reader.includes('data-book={story.id}'));
  assert.ok(!css.includes('.reading-cover-text[data-book]::before'));
  assert.equal(salihArt[5].image,'/stories/salih/page-6-edition-v1.png');
  assert.match(salihArt[5].composition,/collapsed/);
});
