import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('app/page.tsx', 'utf8');
test('favorite count uses the same available catalog, without the random-learning exclusions', () => {
  const availableItems = [
    { key: 'numbers:1', categoryId: 'numbers' },
    { key: 'family:father', categoryId: 'family' },
  ];
  const favorites = ['numbers:1', 'family:father', 'removed:old'];
  const selection = source.match(/const visibleFavorites = ([^;]+);/)[1];
  const selected = vm.runInNewContext(selection, {availableItems, favorites});
  assert.deepEqual(Array.from(selected), ['numbers:1', 'family:father']);
  assert.equal(favorites.length, 3, 'unavailable bookmarks are preserved');
  assert.ok(source.includes('items={homeView === "favorites" ? availableItems : learningItems}'));
  assert.ok(source.includes('favorites={visibleFavorites}'));
});
