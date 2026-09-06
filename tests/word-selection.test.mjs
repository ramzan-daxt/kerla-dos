import test from 'node:test';
import assert from 'node:assert/strict';
import { removeAnswerTile } from '../app/word-selection.mjs';

const chosen = ['0-Н', '1-А', '2-Н', '3-А'];
test('remove first, middle or last tile without removing its neighbours', () => {
  for (let i = 0; i < chosen.length; i++) {
    const result = removeAnswerTile(chosen, chosen[i]);
    assert.deepEqual(result, chosen.filter((_, index) => index !== i));
    assert.equal(result.length, chosen.length - 1);
  }
  assert.deepEqual(chosen, ['0-Н', '1-А', '2-Н', '3-А']);
});
test('identical letters remain distinct tiles', () => {
  assert.deepEqual(removeAnswerTile(chosen, '1-А'), ['0-Н', '2-Н', '3-А']);
});
test('repeated event for the same tile cannot delete its new neighbour', () => {
  const once = removeAnswerTile(chosen, '1-А');
  assert.equal(removeAnswerTile(once, '1-А'), once);
});
test('empty slots and unknown tile IDs do not change the answer', () => {
  assert.equal(removeAnswerTile(chosen, undefined), chosen);
  assert.equal(removeAnswerTile(chosen, 'missing'), chosen);
  assert.deepEqual(removeAnswerTile([], undefined), []);
});
