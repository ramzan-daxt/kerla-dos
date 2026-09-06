import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const exports = {};
vm.runInNewContext(ts.transpile(fs.readFileSync('app/word-translations.ts', 'utf8'), {module: 1}), {exports});
const translate = word => exports.getWordTranslation(word, 'de');
test('German nouns retain capitals and receive their own article', () => {
  for (const [word, expected] of [['Отец','der Vater'],['Мама','die Mutter'],['Ребёнок','das Kind'],['Солнце','die Sonne'],['Луна','der Mond'],['Море','das Meer'],['Линейка','das Lineal']]) assert.equal(translate(word), expected);
});
test('German plural and alternative nouns have appropriate articles', () => {
  for (const word of ['Предки','Волосы','Обувь','Носки','Перчатки','Сапоги','Краски','Виноград']) assert.match(translate(word), /^die /);
  assert.equal(translate('Двоюродный брат или сестра'), 'der Cousin oder die Cousine');
  assert.equal(translate('Воздух; атмосфера'), 'die Luft; die Atmosphäre');
});
test('articles do not leak into adverbs, colors or numerals', () => {
  assert.equal(translate('Утро'), 'der Morgen');
  assert.equal(translate('Завтра'), 'Morgen');
  for (const word of ['Сегодня','Вчера','Рано','Поздно','Красный','Два','Миллион']) assert.doesNotMatch(translate(word), /^(der|die|das) /);
  assert.equal(exports.getWordTranslation('Отец','en'), 'Father');
  assert.equal(exports.getWordTranslation('Отец','ru'), 'Отец');
});
test('every current noun card including alphabet examples has a German article', () => {
  const source = fs.readFileSync('app/page.tsx', 'utf8');
  const categories = vm.runInNewContext(ts.transpile(source.slice(source.indexOf('const categories:'),source.indexOf('const categoryIcons:'))+';categories'), {normalizeChechen:s=>s});
  const adverbs = new Set(['Сегодня','Завтра','Вчера','Рано','Поздно','два']);
  for (const category of categories) {
    if (['numbers','colors'].includes(category.id)) continue;
    for (const word of category.words) {
      if (adverbs.has(word.russian)) continue;
      assert.match(translate(word.russian), /^(der|die|das) /, `${category.id}: ${word.russian}`);
    }
  }
});
