import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

test('every transport and time word has its own shared local illustration', () => {
  const source = fs.readFileSync('app/data/vocabulary.ts', 'utf8') + fs.readFileSync('app/page.tsx', 'utf8');
  const start = source.indexOf('const illustratedWords:');
  const declaration = source.slice(start, source.indexOf('categories.forEach((category) =>', start));
  const images = vm.runInNewContext(ts.transpile(declaration + ';illustratedWords'));
  for (const category of ['transport', 'time']) {
    const block = source.slice(source.indexOf('id: "' + category + '"'));
    const words = block.slice(block.indexOf('words: ['), block.indexOf('\n    ],'));
    const ids = [...words.matchAll(/id: "([^"]+)"/g)].map(match => match[1]);
    assert.equal(ids.length, 14);
    const paths = ids.map(id => images[category + ':' + id]);
    assert.equal(new Set(paths).size, ids.length);
    for (const path of paths) {
      assert.ok(path?.startsWith('/illustrations/' + category + '/'));
      assert.ok(fs.statSync('public' + path).size > 1000);
    }
  }
  assert.ok(source.includes('image: w.image'));
});
