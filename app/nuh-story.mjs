import {normalizeChechen} from './chechen-orthography.mjs';

// Child-friendly paraphrase, not a quotation or certified Quran translation.
// Editorial additions approved by the owner on 2026-09-18.
export const nuhTitle = 'Нухь пайхмарах лаьцна дийцар';
export const nuhSubtitle = 'Делера салам хуьлда цунна';
export const nuhParagraphs = [
  ['Нухьан халкъо АллахӀах къаьстина кхечу хӀуманашна Ӏибадат дора. АллахӀа царна Нухь пайхамар ваийтира.'],
  ['Нухьо уьш дийнахь а, буьйсанна а Цхьана АллахӀана Ӏибадат даре кхойкхура. Амма кӀезиг адамаша бен иман ца диллира.'],
  ['АллахӀа Нухьига доккха хи тӀехь лела кема де аьллера. Цхьаькхаберш цунах белара, амма Нухьо АллахӀан омра кхочушдора.'],
  ['Нухь а, иман диллина берш а кема чу хевшира. АллахӀан омранца цо дийна хӀуманаш а шишша кема чу хийцира.'],
  ['Стиглара чӀогӀа догӀа доладелира. Латтара а хиш схьаладелийра. Хи совдала доладелира.'],
  ['Кема даккхий тулгӀенаш йуккъехьула доьдуш дара. АллахӀа Нухь а, цуьнца болу берш а кӀелхьарабехира.', 'АллахӀан билгалонаш тӀе ца ийцина берш хи чохь бевлира.'],
  ['АллахӀан омранца догӀа сецара, хи лахдала доладелира. Кема Аль-Джуди лам тӀехь сецира.'],
  ['АллахӀа Нухьна маршонца а, беркатца а кема чуьра ара вала элира. Нухь АллахӀана шукру деш волу лай вара.', 'Нухьо АллахӀан омра кхочушдира. Вай а АллахӀана муьтӀахь хила деза.'],
].map(paragraphs=>paragraphs.map(normalizeChechen));

// Six owner-approved beats; editorial metadata, never child-facing headings.
export const nuhBeats = ['setup','intrigue','development','development','climax','climax','resolution','lesson'];
export const nuhSources = [
  {name:'Нухь', reference:'71: 1–5; 23', url:'https://quran.com/nuh', pages:[1,2]},
  {name:'Худ', reference:'11: 36–44; 48', url:'https://quran.com/hud', pages:[2,3,4,6,7,8]},
  {name:'Аль-Къамар', reference:'54: 11–15', url:'https://quran.com/al-qamar', pages:[5,6]},
  {name:'Аль-АӀраф', reference:'7: 64', url:'https://quran.com/al-araf/64', pages:[6]},
  {name:'Аль-Исра', reference:'17: 3', url:'https://quran.com/al-isra/3', pages:[8]},
];
export const nuhArt = [
  {image:'/stories/nuh/page-1-figures-v2.png',edge:'top',composition:'ochre-settlement-with-villagers'},
  {image:'/stories/nuh/page-2-figures-v2.png',edge:'top',composition:'twilight-village-with-neighbors'},
  {image:'/stories/nuh/page-3-edition-v1.png',edge:'bottom',composition:'Unfinished large wooden ark on dry land in upper half, heavy curved ribs and stacked timber, no workers, no people. Wide smooth pale sandy workyard foreground.'},
  {image:'/stories/nuh/page-4-edition-v1.png',edge:'top',composition:'Side view of large wooden ark and low ramp in lower half; two sheep and two goats walking away up ramp, three ordinary residents seen entirely from behind nearby. No singled-out leader. Pale sky above.'},
  {image:'/stories/nuh/page-5-edition-v1.png',edge:'bottom',composition:'Heavy rain falling on sturdy wooden ark in upper half as water rises; no people visible. Bottom 35% smooth light grey-blue water without waves/rain streaks, naturally quiet sheltered foreground.'},
  {image:'/stories/nuh/page-6-edition-v1.png',edge:'top',composition:'Large sturdy wooden ark amid vivid blue rolling waves in lower 58%, empty soft pale grey sky across top42%; dramatic but child-appropriate flood, no people or drowning figures.'},
  {image:'/stories/nuh/page-7-edition-v1.png',edge:'bottom',composition:'Wooden ark resting on a single distant rocky mountain slope upper half as water recedes; no people. Pale smooth sand and shallow still water across foreground, no enclosing mountain border.'},
  {image:'/stories/nuh/page-8.png',edge:'top',composition:'ramp-to-dry-ground'},
];

export const nuhBook = {
  id:'nuh',title:nuhTitle,subtitle:nuhSubtitle,
  cover:'/stories/nuh/cover-clean-v3.png',coverText:true,coverName:'Нухь',
  paragraphs:nuhParagraphs,art:nuhArt,
  sourceGroups:[{name:'Къуръан',entries:nuhSources}],
};
