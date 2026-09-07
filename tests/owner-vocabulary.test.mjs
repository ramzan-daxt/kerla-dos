import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import {normalizeChechen} from '../app/chechen-orthography.mjs';
const classes = {}, translations = {};
for (const [file, exports] of [['word-classes',classes],['word-translations',translations]]) vm.runInNewContext(ts.transpile(fs.readFileSync(`app/${file}.ts`,'utf8'),{module:1}),{exports});
const source = fs.readFileSync('app/page.tsx','utf8');
const categories = vm.runInNewContext(ts.transpile(source.slice(source.indexOf('const categories:'),source.indexOf('const alphabetCategory ='))+';categories'),{normalizeChechen,getWordClass:classes.getWordClass});
const words = categories.flatMap(c=>c.words.map(w=>({...w,key:`${c.id}:${w.id}`})));
const expected = {
  'food:butter':['Налха','бу'],
  'fruit:tomato-vegetable':['Бадарж','йу'], 'clothes:jacket':['Куьртиг','йу'], 'clothes:skirt':['Йупка','йу'],
  'home:key':['ДогӀа','ду'], 'home:closet':['Ишкап','йу'], 'home:lamp':['Стогар','бу'], 'home:fridge':['Шаьлдар','йу'],
  'transport:car':['Машен','йу'], 'transport:train':['ЦӀерпошт','йу'], 'transport:plane':['Кема','ду'],
  'transport:bicycle':['Вилиспет','йу'], 'transport:ship':['ХӀордкема','ду'], 'transport:tractor':['Чатаз','йу'],
  'transport:truck':['Йоккха машен','йу'],
};
test('owner word replacements and their classes reach shared game and card data',()=>{
  for (const [key,[word,marker]] of Object.entries(expected)) {
    const card=words.find(w=>w.key===key); assert.ok(card,key);
    assert.equal(card.chechen,word,key); assert.equal(card.classMarker,marker,key);
    assert.equal(card.audioSrc,undefined,`No stale recording: ${key}`);
  }
});
test('all owner class approvals are applied wherever their words occur',()=>{
  for(const [word,marker] of Object.entries(classes.ownerClasses)) {
    const matches=words.filter(w=>(w.example||w.chechen).toLowerCase().replace(/ӏ/g,'Ӏ')===word);
    assert.ok(matches.length,word);
    for(const card of matches) assert.equal(card.classMarker,marker,card.key);
  }
  assert.equal(classes.getWordClass('Шича'),'ву/йу');
});
test('key is singular in every translation and keeps its stable ID',()=>{
  assert.equal(words.find(w=>w.key==='home:key').russian,'Ключ');
  assert.equal(translations.getWordTranslation('Ключ','en'),'Key');
  assert.equal(translations.getWordTranslation('Ключ','de'),'der Schlüssel');
});
test('removed vehicles cannot enter categories, random games or favorites',()=>{
  assert.equal(words.length,273);
  assert.equal(categories.find(c=>c.id==='transport').words.length,12);
  assert.ok(!words.some(w=>['transport:taxi','transport:scooter'].includes(w.key)));
  for(const word of ['Такси','Самокат']) for(const lang of ['en','de']) assert.equal(translations.getWordTranslation(word,lang),'');
});
