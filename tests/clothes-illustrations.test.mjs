import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

test('all eleven active clothing words have distinct shared illustrations', () => {
  const source = fs.readFileSync('app/data/vocabulary.ts', 'utf8') + fs.readFileSync('app/page.tsx', 'utf8');
  const start = source.indexOf('const illustratedWords:');
  const declaration = source.slice(start, source.indexOf('categories.forEach((category) =>', start));
  const images = vm.runInNewContext(ts.transpile(declaration + ';illustratedWords'));
  const ids = ['shirt', 'trousers', 'hat', 'dress', 'shoes', 'socks', 'scarf', 'coat', 'jacket', 'gloves', 'boots'];
  const paths = ids.map(id => images[`clothes:${id}`]);
  assert.equal(new Set(paths).size, ids.length);
  for (const path of paths) {
    assert.ok(path?.startsWith('/illustrations/clothes/'));
    assert.ok(fs.statSync(`public${path}`).size > 1000);
  }
  assert.ok(source.includes('image: w.image'));
});
