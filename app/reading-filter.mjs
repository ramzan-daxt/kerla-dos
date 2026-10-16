export const readingSections = [
  {id:'all',label:'Дерриге'},
  {id:'prophets',label:'Пайхмарашах лаьцна дийцарш'},
  {id:'tales',label:'Туьйранаш'},
  {id:'stories',label:'Дийцараш'},
];
export function filterReadingBooks(books,section,query){
  const term=query.trim().toLocaleLowerCase().replace(/\s+/g,' ');
  return books.filter(book=>
    (section==='all'||(book.section??'prophets')===section)&&
    (!term||book.title.toLocaleLowerCase().includes(term)||book.coverName.toLocaleLowerCase().includes(term))
  );
}
