import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const extras = fs.readFileSync('app/home-extras.tsx', 'utf8');
const page = fs.readFileSync('app/page.tsx', 'utf8');
test('leaving a card invalidates pending audio and releases its source', () => {
  const calls = [];
  const wordAudioRequest = { current: 4 };
  const wordAudio = { current: {
    pause: () => calls.push('pause'),
    removeAttribute: name => calls.push(name),
    load: () => calls.push('load'),
  } };
  const body = extras.split('function stopWordAudio() {')[1].split('    useLayoutEffect')[0];
  vm.runInNewContext(`function stopWordAudio() {${body}; stopWordAudio();`, {
    wordAudioRequest, wordAudio,
    window: { speechSynthesis: {} }, speechSynthesis: { cancel: () => calls.push('cancel') },
  });
  assert.equal(wordAudioRequest.current, 5);
  assert.equal(wordAudio.current, null);
  assert.deepEqual(calls, ['pause', 'src', 'load', 'cancel']);
  assert.ok(extras.includes('request !== wordAudioRequest.current'));
  assert.ok(extras.includes('useLayoutEffect(() => () => stopWordAudio(), [view, item?.key, favoriteItem?.key])'));
});
test('category swipes stop audio before changing or animating the card', () => {
  const move = page.split('function moveCard(direction: -1 | 1) {')[1].split('function choose')[0];
  assert.ok(move.indexOf('stopAudio();') < move.indexOf('setIndex('));
  assert.ok(move.indexOf('stopAudio();') < move.indexOf('setCardMotion('));
});
