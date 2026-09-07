import test from 'node:test';
import assert from 'node:assert/strict';
import { createAudioPool } from '../app/audio-pool.mjs';

test('prepares bounded neighbors without playing and reuses prepared clips', () => {
  const original = globalThis.Audio;
  const instances = [];
  globalThis.Audio = class {
    constructor() { instances.push(this); this.paused = false; }
    load() {}
    pause() { this.paused = true; }
    removeAttribute() { this.src = ''; }
    play() { throw new Error('preload must not play'); }
  };
  try {
    const pool = createAudioPool();
    pool.prepare(['a', 'b', 'c']);
    const b = pool.get('b');
    pool.prepare(['b', 'c', 'd']);
    assert.equal(pool.get('b'), b);
    assert.equal(instances.length, 4);
    assert.equal(instances[0].src, '');
    assert.equal(b.preload, 'auto');
    pool.clear();
    assert.ok(instances.every(clip => clip.paused && clip.src === ''));
  } finally { globalThis.Audio = original; }
});
