import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

test('all ten food cards have distinct local illustrations in shared data', () => {
  const source = fs.readFileSync('app/data/vocabulary.ts', 'utf8') + fs.readFileSync('app/page.tsx', 'utf8');
  const declaration = source.slice(source.indexOf('const illustratedWords:'), source.indexOf('categories.forEach((category) =>', source.indexOf('const illustratedWords:')));
  const images = vm.runInNewContext(ts.transpile(declaration + ';illustratedWords'));
  const ids = ['bread', 'milk', 'cheese', 'meat', 'butter', 'honey', 'salt', 'water-food', 'rice', 'soup'];
  const paths = ids.map(id => images[`food:${id}`]);
  assert.equal(new Set(paths).size, ids.length);
  for (const [index, path] of paths.entries()) {
    assert.ok(path?.startsWith('/illustrations/food/'), ids[index]);
    assert.ok(fs.statSync(`public${path}`).size > 1000, path);
  }
  assert.ok(source.includes('image: w.image'), 'shared game/random/favorites data keeps illustrations');
});
