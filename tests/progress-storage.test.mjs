import test from 'node:test';
import assert from 'node:assert/strict';
import { readProgress, writeProgress } from '../app/lib/progress-storage.mjs';

const defaults = { script: 'cyrillic', translation: 'off', volume: .9, rate: .72,
  autoSpeak: true, repeat: false, gameSounds: true, largeText: false,
  reduceMotion: false, difficulty: 4, mosaicPieces: 9, mosaicMode: 'tray',
  reviewErrors: true, dailyGoal: 10 };
function memory(entries = {}) {
  const data = new Map(Object.entries(entries));
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
}

test('saved settings, favorites and lesson survive a round trip', () => {
  const storage = memory();
  const progress = { ...readProgress(storage, defaults), stars: 12, premium: true,
    settings: { ...defaults, translation: 'de', autoSpeak: false, volume: .4 },
    favorites: ['animals:cat'], learnedWords: ['animals:cat'],
    lastLesson: { categoryId: 'animals', index: 2 } };
  assert.equal(writeProgress(storage, progress), true);
  assert.deepEqual(readProgress(storage, defaults), progress);
});

test('invalid JSON, types, ranges and duplicate favorites are rejected', () => {
  const progress = readProgress(memory({
    'kerla-stars': '-3', 'kerla-settings': JSON.stringify({ volume: 8, difficulty: 100, translation: 'xx', repeat: 'false' }),
    'kerla-favorites': '["animals:cat",null,4,"animals:cat"]',
    'kerla-learned-words': '{broken',
    'kerla-last-lesson': '{"categoryId":"animals","index":-1}',
  }), defaults);
  assert.equal(progress.stars, 0);
  assert.deepEqual(progress.settings, defaults);
  assert.deepEqual(progress.favorites, ['animals:cat']);
  assert.deepEqual(progress.learnedWords, []);
  assert.equal(progress.lastLesson, null);
});

test('blocked storage and a full quota do not crash learning', () => {
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('full'); } };
  const progress = readProgress(blocked, defaults);
  assert.equal(progress.stars, 0);
  assert.deepEqual(progress.settings, defaults);
  assert.equal(writeProgress(blocked, progress), false);
  assert.equal(writeProgress(null, progress), false);
});

test('the legacy autoplay migration runs once', () => {
  const storage = memory({ 'kerla-settings': JSON.stringify({ autoSpeak: false }) });
  assert.equal(readProgress(storage, defaults).settings.autoSpeak, true);
  writeProgress(storage, { ...readProgress(storage, defaults), settings: { ...defaults, autoSpeak: false } });
  assert.equal(readProgress(storage, defaults).settings.autoSpeak, false);
});
