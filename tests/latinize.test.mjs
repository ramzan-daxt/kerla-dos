import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync('app/script-text.tsx', 'utf8');
const core = source.slice(source.indexOf('const pairs:'), source.indexOf('function transform')).replace('export function', 'function');
const latinize = vm.runInNewContext(ts.transpile(core + ';latinize'));

test('standalone soft signs never leak into Latin text', () => {
  assert.equal(latinize('пальто'), "pal'to");
  assert.equal(latinize('Пальто'), "Pal'to");
  assert.equal(latinize('аь оь уь хь'), 'ä ö ü ẋ');
  assert.equal(latinize("pal'to"), "pal'to");
});

test('all vocabulary and alphabet examples produce Cyrillic-free Latin text', () => {
  const data = readFileSync('app/data/vocabulary.ts', 'utf8');
  let count = 0;
  for (const match of data.matchAll(/(?:chechen|example):\s*"([^"]*)"/g)) {
    assert.doesNotMatch(latinize(match[1]), /\p{Script=Cyrillic}/u, match[1]);
    count++;
  }
  assert.ok(count > 100);
});
