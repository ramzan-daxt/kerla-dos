import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

test('all category pattern icons and shared ornament are present', () => {
  const source = fs.readFileSync('app/data/vocabulary.ts', 'utf8');
  const mapping = source.split('const categoryIcons: Record<string, string> = {')[1].split('};')[0];
  const icons = [...mapping.matchAll(/"(\/icons\/[^"]+)"/g)].map(match => match[1]);
  assert.equal(icons.length, 14);
  for (const icon of icons) assert.ok(fs.existsSync(`public${icon}`), icon);
  assert.ok(fs.existsSync('public/backgrounds/chechen-ornament-v1.png'));
  assert.ok(fs.readFileSync('app/category-pattern.tsx', 'utf8').includes('aria-hidden="true"'));
  assert.ok(fs.readFileSync('app/category-pattern.css', 'utf8').includes('pointer-events: none'));
});
