import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {salihParagraphs,salihArt} from '../app/salih-story.mjs';

test('Salih interior uses live text without the shared painted wash',()=>{
  const reader=readFileSync(new URL('../app/reading-library.tsx',import.meta.url),'utf8');
  const css=readFileSync(new URL('../app/adam-book.css',import.meta.url),'utf8');
  assert.match(reader,/story.id==='salih' && story.art\[index-1\].image.includes\('-relief-'\)/);
  assert.match(css,/\.salih-scene-copy\{[^}]*clamp\(16px,/);
  assert.doesNotMatch(css,/\.salih-scene-copy::(?:before|after)/);
  assert.equal(salihParagraphs.length,7);
  assert.equal(salihParagraphs[3][0],'Эмкална хи мала шен де дара. Адамашна а шайн де дара.');
  assert.ok(salihArt.every(art=>/-relief-|-edition-/.test(art.image)));
  assert.ok(reader.includes("image.includes('-edition-')"));
  assert.ok(css.includes('.story-scene-copy{'));
  assert.doesNotMatch(css,/\.story-scene-copy::(?:before|after)/);
  assert.ok(reader.includes('data-layout='));
  assert.match(css,/\.salih-scene-copy\[data-layout="open"\]\[data-page="2"\]/);
  for(const page of [2,4,5,7]) assert.ok(css.includes(`.salih-scene-copy[data-page="${page}"]`));
});
