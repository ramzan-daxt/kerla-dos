import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('child-facing screens omit reading-dependent tap and drag instructions', () => {
  const source = ['page.tsx', 'home-extras.tsx', 'game-center.tsx']
    .map(file => readFileSync(new URL(`../app/${file}`, import.meta.url), 'utf8'))
    .join('\n');
  for (const hint of ['Хаза, суьрта тӀетаӀайе', 'Дош хаза тӀетаӀайе',
    'Элпаш тӀетаӀайе', 'Дакъа лахара схьалаца', 'Ши дакъа харжа',
    'Дош схьакъастина лардан дог тӀетаӀайе']) {
    assert.equal(source.includes(hint), false, hint);
  }
});
