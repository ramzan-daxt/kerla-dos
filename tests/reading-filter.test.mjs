import test from 'node:test';
import assert from 'node:assert/strict';
import {filterReadingBooks} from '../app/reading-filter.mjs';
import {readingBooks} from '../app/reading-books.mjs';
test('reading search trims and ignores case without changing catalog order',()=>{
  assert.deepEqual(filterReadingBooks(readingBooks,'all',''),readingBooks);
  assert.deepEqual(filterReadingBooks(readingBooks,'all','  НУХЬ ').map(x=>x.id),['nuh']);
  assert.deepEqual(filterReadingBooks(readingBooks,'all','Салих').map(x=>x.id),['salih']);
  assert.equal(filterReadingBooks(readingBooks,'all','zzzz').length,0);
});
test('reading categories combine with search and support future books',()=>{
  assert.equal(filterReadingBooks(readingBooks,'tales','').length,0);
  const books=[...readingBooks,{title:'Тест',coverName:'Тест',section:'tales'}];
  assert.equal(filterReadingBooks(books,'tales','тест').length,1);
  assert.equal(filterReadingBooks(books,'prophets','тест').length,0);
});
