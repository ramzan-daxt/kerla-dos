import test from 'node:test';
import assert from 'node:assert/strict';
import { addAnswerTile, removeAnswerTile } from '../app/word-selection.mjs';

const chosen = ['0-Н', '1-А', '2-Н', '3-А'];
test('remove first, middle or last tile without removing its neighbours', () => {
  for (let i = 0; i < chosen.length; i++) {
    const result = removeAnswerTile(chosen, chosen[i]);
    assert.deepEqual(result, chosen.map((id, index) => index === i ? '' : id));
    assert.equal(result.length, chosen.length);
  }
  assert.deepEqual(chosen, ['0-Н', '1-А', '2-Н', '3-А']);
});
test('identical letters remain distinct tiles', () => {
  assert.deepEqual(removeAnswerTile(chosen, '1-А'), ['0-Н', '', '2-Н', '3-А']);
});
test('replacement fills a gap without shifting later letters', () => {
  assert.deepEqual(addAnswerTile(removeAnswerTile(chosen, '1-А'), '1-А'), chosen);
  const gaps = removeAnswerTile(removeAnswerTile(chosen, '0-Н'), '2-Н');
  assert.deepEqual(addAnswerTile(gaps, '2-Н'), ['2-Н', '1-А', '', '3-А']);
  assert.equal(addAnswerTile(chosen, '1-А'), chosen);
  assert.deepEqual(addAnswerTile([], '0-Н'), ['0-Н']);
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
