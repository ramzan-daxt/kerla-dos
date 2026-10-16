import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const page=fs.readFileSync('app/page.tsx','utf8');
test('alphabet overview uses the current vocabulary and opens the chosen card',()=>{
 assert.match(page,/active\.words\.map\(\(word, letterIndex\)/);
 assert.match(page,/open\(active, letterIndex\)/);
 assert.match(page,/aria-expanded=\{alphabetOverview\}/);
 assert.match(page,/mode !== "learn" \|\| alphabetOverview/);
});
