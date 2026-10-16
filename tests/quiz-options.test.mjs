import test from 'node:test';
import assert from 'node:assert/strict';
import { quizOptions } from '../app/lib/quiz-options.mjs';
const words = Array.from({ length: 12 }, (_, i) => ({ id: `word-${i}` }));

test('each round has exactly one correct answer, no duplicates, and no input mutation', () => {
  const original = [...words];
  for (let round = 0; round < 100; round++) {
    const target = words[round % words.length];
    for (const count of [2, 3, 4]) {
      const options = quizOptions(words, target.id, count, round);
      assert.equal(options.length, count);
      assert.equal(options.filter(word => word === target).length, 1);
      assert.equal(new Set(options).size, count);
    }
  }
  assert.deepEqual(words, original);
});

test('answers stay stable across renders and vary between rounds', () => {
  assert.deepEqual(quizOptions(words, words[0].id, 4, 0), quizOptions(words, words[0].id, 4, 0));
  const positions = new Set(Array.from({ length: 30 }, (_, round) =>
    quizOptions(words, words[0].id, 4, round).findIndex(word => word.id === words[0].id)));
  assert.equal(positions.size, 4);
});

test('short and missing word lists are safe', () => {
  assert.deepEqual(quizOptions([], 'missing', 4, 0), []);
  assert.deepEqual(quizOptions(words.slice(0, 1), words[0].id, 4, 0), [words[0]]);
  assert.deepEqual(quizOptions(words, 'missing', 4, 0), []);
});
