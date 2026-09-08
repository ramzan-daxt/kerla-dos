import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { normalizeChechen } from '../app/chechen-orthography.mjs';

test('owner spelling expands vowels, preserves soft signs and case', () => {
  assert.equal(normalizeChechen('я яь ю юь Ялх Юьхь ЯЬ ЮЬ ЮХА'), 'йа йаь йу йуь Йалх Йуьхь ЙАЬ ЙУЬ ЙУХА');
  assert.equal(normalizeChechen('Ткъе ялх, юха, юьзина, серлаяьлла'), 'Ткъе йалх, йуха, йуьзина, серлайаьлла');
});
test('normalization is idempotent and preserves Latin transcription', () => {
  const text='Йа йаь Йу йуь Йалх Ӏаж l Ya Yü';
  assert.equal(normalizeChechen(text), text);
});
test('all current Chechen word and category fields use the chosen spelling', () => {
  const source=readFileSync(new URL('../app/page.tsx',import.meta.url),'utf8');
  for(const match of source.matchAll(/(?:chechen|title):\s*"([^"]*)"/g)) assert.doesNotMatch(match[1],/[ЯяЮю]/);
  assert.match(source,/chechen: "Йалх", russian: "Шесть"/);
  assert.match(source,/chechen: "Йуьхь", russian: "Лицо"/);
  assert.match(source,/russian: "Учитель \/ учительница"/);
  assert.match(source,/russian: "Рюкзак"/);
});
test('story and Chechen interface text do not regress to the old spelling', () => {
  for(const file of ['full-story.tsx','home-extras.tsx','game-center.tsx','settings.tsx']) {
    const source=readFileSync(new URL('../app/'+file,import.meta.url),'utf8');
    const tree=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
    function visit(node){
      if(ts.isStringLiteral(node)||ts.isJsxText(node)||ts.isNoSubstitutionTemplateLiteral(node)||ts.isTemplateHead(node)||ts.isTemplateMiddle(node)||ts.isTemplateTail(node)) {
        assert.doesNotMatch(node.text,/[ЯяЮю]/,`${file}: ${node.text}`);
      }
      ts.forEachChild(node,visit);
    }
    visit(tree);
  }
});
