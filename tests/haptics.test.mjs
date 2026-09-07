import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('app/haptics.mjs', 'utf8').replace('export function', 'function');
test('one short pulse on supported devices', () => {
  const pulses = [];
  vm.runInNewContext(source + '; tapHaptic();', { navigator: { vibrate: ms => pulses.push(ms) } });
  assert.deepEqual(pulses, [15]);
});
test('unavailable or rejected vibration does not break interactions', () => {
  for (const context of [{}, { navigator: {} }, { navigator: { vibrate() { throw new Error('blocked'); } } }]) {
    assert.doesNotThrow(() => vm.runInNewContext(source + '; tapHaptic();', context));
  }
});
