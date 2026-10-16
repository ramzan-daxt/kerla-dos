import {normalizeChechen} from './chechen-orthography.mjs';

// Simple editorial paraphrase, not a quotation or certified Quran translation.
// Editorial additions approved by the owner on 2026-09-18.
export const hudTitle = 'Худ пайхмарах лаьцна дийцар';
export const hudSubtitle = 'Делера салам хуьлда цунна';
export const hudParagraphs = [
  ['Ӏад цӀе йолу халкъ хилла. АллахӀа царна ницкъ а, бешанаш а, хьосташ а делла.'],
  ['АллахӀа царна Худ пайхамар ваийтира. Худо уьш Цхьана АллахӀана Ӏибадат даре кхойкхура.'],
  ['Амма цара куралалла йора. Шайх ницкъ болуш кхин цхьа а вац моттара царна. Цара Худан дош ца тӀеийцира.'],
  ['Царна шайн йуххе догӀуш марха гира. Цуьнца догӀа догӀур ду моьттира царна.'],
  ['Амма цуьнца чӀогӀа мох баьлла. Из АллахӀан Ӏазап дара. Церан ницкъо уьш кӀелхьара ца бехира.', 'Церан цӀенош бен ца дисира.'],
  ['АллахӀа Шен къинхетамца Худ а, цуьнца иман диллина берш а кӀелхьарабехира.', 'Куралла йан йиш йац. АллахӀана шукру дан деза.'],
].map(paragraphs=>paragraphs.map(normalizeChechen));

export const hudBeats = ['setup','intrigue','development','climax','resolution','lesson'];
export const hudSources = [
  {name:'Аль-АӀраф',reference:'7: 65–72',url:'https://quran.com/al-araf/65',pages:[1,2,3,6]},
  {name:'Аш-ШуӀара',reference:'26: 123–139',url:'https://quran.com/ash-shuara/132',pages:[1,2,3,6]},
  {name:'Фуссилат',reference:'41: 15–16',url:'https://quran.com/fussilat/15',pages:[3,5,6]},
  {name:'Аль-Ахкъаф',reference:'46: 24–26',url:'https://quran.com/al-ahqaf/24',pages:[4,5]},
  {name:'Худ',reference:'11: 58',url:'https://quran.com/hud/58',pages:[6]},
];
export const hudArt = [
  {image:'/stories/hud/page-1-edition-v1.png',edge:'top',composition:'Warm ancient oasis village: ordinary residents from behind beside flowing spring and lush palms in lower65%, ochre homes low beyond. Wide pale sky above.'},
  {image:'/stories/hud/page-2-edition-v1.png',edge:'bottom',composition:'Ordinary men and fully covered women in small dispersed neighbor groups along sunlit ochre village street upper65%, seen from back/sideback, no preacher or leader. Bottom35% broad smooth pale street.'},
  {image:'/stories/hud/page-3-edition-v1.png',edge:'top',composition:'Tall robust ochre walls and imposing dwellings lower65%, ordinary villagers seen from behind standing with self-important upright postures, no central leader. Empty pale sky above.'},
  {image:'/stories/hud/page-4-edition-v1.png',edge:'bottom',composition:'Several ordinary residents seen from behind watching large approaching dark cloud over oasis buildings in upper65%. Wind not yet severe. Bottom35% smooth pale sandy courtyard.'},
  {image:'/stories/hud/page-5-edition-v1.png',edge:'top',composition:'Abandoned ochre dwellings after destructive wind lower58%, broken palm fronds, damaged roofs, sand drifted against doorways, no people or bodies. Empty pale dusty sky top42%, no flying objects there.'},
  {image:'/stories/hud/page-6-edition-v1.png',edge:'bottom',composition:'Small ordinary believing families safely together near modest shelter and calm palms upper58%, equal grouping, all seen from back/sideback, women fully covered; no prophet or leader. Smooth pale sand bottom42%.'},
];
export const hudBook = {
  id:'hud',title:hudTitle,subtitle:hudSubtitle,
  cover:'/stories/hud/cover-clean-v2.png',coverText:true,coverName:'Худ',
  paragraphs:hudParagraphs,art:hudArt,
  sourceGroups:[{name:'Къуръан',entries:hudSources}],
};
