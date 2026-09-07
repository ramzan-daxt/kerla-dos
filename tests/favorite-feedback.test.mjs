import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function fixture(reduced = false) {
  const calls = [];
  const source = ts.transpileModule(fs.readFileSync('app/favorite-feedback.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const context = { exports: {}, window: { matchMedia: () => ({ matches: reduced }) } };
  vm.runInNewContext(source, context);
  const button = { closest: () => null, animate: (frames, options) => {
    calls.push({ frames, options });
    return { cancel: () => calls.push('cancel') };
  } };
  return { run: adding => context.exports.favoriteFeedback(button, adding), calls };
}
test('adding springs with a halo; removing is a shorter pulse', () => {
  const f = fixture();
  f.run(true);
  assert.equal(f.calls[0].options.duration, 480);
  assert.ok(f.calls[0].frames.some(frame => frame.boxShadow));
  f.run(false);
  assert.equal(f.calls[1], 'cancel');
  assert.equal(f.calls[2].options.duration, 240);
});
test('respects reduced motion without starting an animation', () => {
  const f = fixture(true);
  f.run(true);
  assert.equal(f.calls.length, 0);
});
