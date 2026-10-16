import {normalizeChechen} from './chechen-orthography.mjs';

// Editorial paraphrase for shared reading, not a verbatim Quran translation.
// Editorial additions approved by the owner on 2026-09-18.
export const salihTitle = 'Салихь пайхмарах лаьцна дийцар';
export const salihSubtitle = 'Делера салам хуьлда цунна';
export const salihParagraphs = [
  ['Самуд цӀе йолу халкъ хилла. Цара ламнашкахь цӀенош дора. Церан бешанаш а, хьосташ а хилла.'],
  ['АллахӀа царна Салихь пайхамар ваийтира. Цо уьш Цхьана АллахӀана Ӏибадат даре кхойкхура. Цхьаькхабераша иман диллира.'],
  ['Стен эмкал царна АллахӀан билгало йара. Салихьо цунна зе ма де аьлла тӀедиллина.'],
  ['Эмкална хи мала шен де дара. Адамашна а шайн де дара.', 'Цунна зе дича, Ӏазап тӀекхочур хилар Салихьо царна дийцира.'],
  ['Амма иман ца диллинчарна Салихьан дош тӀеэца ца лаьара. Цара АллахӀан омра ца кхочушдира: эмкал йийра.', 'Салихьо царна кхо де бен ца дисина хилар дийцира.'],
  ['Кхо де даьлча, царна АллахӀан Ӏазап тӀекхечира. Латта чӀогӀа дегаделира. Иман ца диллина, омра ца кхочушдина берш шайн цӀеношкахь бевлира.'],
  ['АллахӀа Шен къинхетамца Салихь а, цуьнца иман диллина берш а кӀелхьарабехира.', 'АллахӀан омра кхочушдан деза.'],
].map(paragraphs=>paragraphs.map(normalizeChechen));

export const salihBeats = ['setup','intrigue','development','development','climax','resolution','lesson'];
export const salihSources = [
  {name:'Аль-АӀраф',reference:'7: 73–79',url:'https://quran.com/al-araf/73',pages:[1,2,3,4,5,6]},
  {name:'Аш-ШуӀара',reference:'26: 146–158',url:'https://quran.com/ash-shuara/155',pages:[1,3,4,5,6]},
  {name:'Худ',reference:'11: 61–68',url:'https://quran.com/hud/65',pages:[2,3,5,6,7]},
];
export const salihArt = [
  {image:'/stories/salih/page-1-edition-v1.png',edge:'top',composition:'Ancient rock-carved homes in orange sandstone outcrop low behind small garden and spring; ordinary residents seen from back lower half. No overhead rock framing. Top35% wide empty pale sky.'},
  {image:'/stories/salih/page-2-edition-v1.png',edge:'bottom',composition:'Ordinary neighbors, men and fully covered women, casually gathered in warm village courtyard upper65%; dispersed equal groups, back/sideback views, no preacher. Bottom35% smooth pale ground. Rich sculpted paper relief.'},
  {image:'/stories/salih/page-3-relief-open-v2.png',edge:'top',composition:'she-camel-grazing'},
  {image:'/stories/salih/page-4-relief-open-v2.png',edge:'bottom',composition:'she-camel-drinking'},
  {image:'/stories/salih/page-5-edition-v1.png',edge:'top',composition:'A single motionless dead female camel lying peacefully on her side beside watering place lower58%, legs resting naturally, face turned fully away. No wounds blood weapons or people. Gentle solemn preschool depiction. Empty pale sky top42%.'},
  {image:'/stories/salih/page-6-edition-v1.png',edge:'bottom',composition:'Abandoned cracked and partly collapsed rock-carved settlement after earthquake upper58%, fallen stone blocks near damaged doorways. No people, bodies or animals. Bottom42% smooth pale sandy foreground, cracks confined above.'},
  {image:'/stories/salih/page-7-edition-v1.png',edge:'bottom',composition:'Small ordinary families safe together beside peaceful garden and modest dwellings upper65%, no central leader; all from back/sideback; women hair and neck fully covered. Bottom35% smooth pale sandy ground.'},
];
export const salihBook = {
  id:'salih',title:salihTitle,subtitle:salihSubtitle,
  cover:'/stories/salih/cover-clean-v2.png',coverText:true,coverName:'Салихь',
  paragraphs:salihParagraphs,art:salihArt,
  sourceGroups:[{name:'Къуръан',entries:salihSources}],
};
