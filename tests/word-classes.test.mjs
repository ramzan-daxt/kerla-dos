import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const exports = {};
vm.runInNewContext(ts.transpile(fs.readFileSync('app/word-classes.ts', 'utf8'), {module: 1}), {exports});
const {getWordClass, classEvidence} = exports;
test('school people support both owner-approved classes', () => {
  assert.equal(getWordClass('дешархо'), 'ву/йу');
  assert.equal(getWordClass('хьехархо'), 'ву/йу');
});
test('reviewed noun classes preserve Chechen classes rather than Russian genders', () => {
  for (const [word, marker] of [['да','ву'],['нана','йу'],['бер','ду'],['уьстагӀ','бу'],['нускал','ду'],['борз','йу'],['балл','йу']]) assert.equal(getWordClass(word), marker);
});
test('plural forms use the reviewed plural indicator', () => {
  for (const [word, marker] of [['дай','бу'],['месаш','йу'],['кемсаш','йу'],['басарш','ду'],['каранаш','ду']]) assert.equal(getWordClass(word), marker);
});
test('ambiguous words and non-nouns are never assigned a guessed class', () => {
  for (const word of ['вертолёт','бадар','тахана','шиъ']) assert.equal(getWordClass(word), undefined);
});
test('shared lookup handles letter case and owner spelling', () => {
  assert.equal(getWordClass('УЬСТАГӏ'), 'бу');
  assert.equal(getWordClass('юьхь'), 'йу');
});
test('every reviewed entry has a valid class and PDF page, without duplicates', () => {
  const seen = new Set();
  for (const line of classEvidence.split('\n')) {
    const [word, marker, page] = line.split('|');
    assert.ok(!seen.has(word), word); seen.add(word);
    assert.ok(['ву','йу','ду','бу'].includes(marker));
    assert.ok(Number(page) >= 19 && Number(page) <= 550);
  }
});
