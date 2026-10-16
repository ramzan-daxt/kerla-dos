import {adamParagraphs,adamSources,adamSourceEntries,adamTitle,adamSubtitle} from './adam-story.mjs';
import {adamArt} from './adam-art.mjs';
import {nuhBook} from './nuh-story.mjs';
import {hudBook} from './hud-story.mjs';
import {salihBook} from './salih-story.mjs';

export const adamBook = {
  id:'adam',title:adamTitle,subtitle:adamSubtitle,
  cover:'/stories/adam/cover-clean-v3.png',coverText:true,coverName:'Адам',
  paragraphs:adamParagraphs,art:adamArt,
  sourceGroups:[
    {name:'Къуръан',entries:adamSourceEntries},
    {name:'СахьихӀ аль-Бухари',entries:adamSources.filter(source=>source.label.startsWith('СахьихӀ аль-Бухари ·')).map(source=>({name:'',reference:`№ ${source.label.split(' · ')[1]}`}))},
  ],
};
export const readingBooks = [adamBook,nuhBook,hudBook,salihBook];
