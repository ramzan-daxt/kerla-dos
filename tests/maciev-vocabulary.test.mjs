import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { normalizeChechen } from '../app/chechen-orthography.mjs';

const source = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
const start = source.indexOf('const categories:');
const end = source.indexOf('const categoryIcons:');
assert.ok(start >= 0 && end > start);
const categories = JSON.parse(vm.runInNewContext(ts.transpile(
  source.slice(start, end) + '\nJSON.stringify(categories)',
  { target: ts.ScriptTarget.ES2020 }
), { normalizeChechen }));
const expected = {
  'fruit:apricot': 'Шаптал', 'fruit:peach': 'ГӀаммагӀа',
  'fruit:cherry': 'Балл', 'fruit:pomegranate': 'Нар',
  'fruit:strawberry': 'ЦӀазам', 'fruit:onion': 'Хох',
  'fruit:watermelon': 'Хорбаз', 'fruit:corn-vegetable': 'ХьаьжкӀа',
  'fruit:potato-vegetable': 'Картолг', 'clothes:socks': 'Пазаташ',
  'clothes:gloves': 'Каранаш', 'clothes:boots': 'Эткаш',
  'school:scissors': 'Тукар', 'body:skin': 'Чкъор',
  'nature:sky': 'Стигал', 'nature:cloud': 'Марха',
  'nature:forest': 'Хьун', 'numbers:sixteen': 'Йалхитта',
  'numbers:seventeen': 'ВуьрхӀитта', 'numbers:eighteen': 'БерхӀитта',
  'numbers:nineteen': 'Ткъаесна', 'time:minute': 'Минут',
};
const words = new Map(categories.flatMap(c => c.words.map(w => [`${c.id}:${w.id}`, w])));

test('all corrected words reach the shared category data with stable IDs', () => {
  assert.equal(words.size, 275);
  for (const [key, value] of Object.entries(expected)) {
    assert.equal(words.get(key)?.chechen, value, key);
  }
});

test('owner-approved sheep meaning and historical modern usage are preserved', () => {
  assert.equal(words.get('animals:sheep').chechen, 'УьстагӀ');
  assert.equal(words.get('animals:sheep').russian, 'Овца');
  assert.equal(words.get('alphabet:letter-29').example, 'уьстагӀ');
  assert.equal(words.get('school:book').chechen, 'Жайна');
  assert.equal(words.get('home:house').chechen, 'ЦӀа');
});

test('corrections are not assigned stale recordings by stable card IDs', () => {
  for (const key of Object.keys(expected)) {
    assert.equal(words.get(key).audioSrc, undefined, key);
    const [category, id] = key.split(':');
    assert.equal(existsSync(new URL(`../public/audio/${category}/${id}.wav`, import.meta.url)), false, key);
  }
});

test('obsolete corrected forms do not survive in vocabulary examples or words', () => {
  const obsolete = /^(Куьрк|Вишни|Наш|ЦӀенна|Пезагаш|Эчигаш|Перчаткаш|ХӀорш|Стигла|Морх|Хьуьн|Харбуз|ХьажкӀа|Йалхийтта|ВорхӀийтта|БархӀийтта|Ткъоьсна|Минот)$/iu;
  for (const [key, word] of words) {
    assert.doesNotMatch(word.example || word.chechen, obsolete, key);
  }
});
