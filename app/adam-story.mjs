// Original copy plus editorial additions approved by the owner on 2026-09-18.
// Preserve original paragraphs verbatim; this is a retelling,
// not a quotation or a certified translation of scripture.
export const adamTitle = "Адам пайхмарах лаьцна дийцар";
export const adamSubtitle = "Делера салам хуьлда цунна";
export const adamParagraphs = [
  ["АллахӀа Адам кхоьллина. Адам ву дерриге адамийн да."],
  ["АллахӀа адамаш Шена Ӏибадат дарна кхоьллина."],
  ["АллахӀа Адам латтах кхоьллина. Цунна хӀуманийн цӀераш а Ӏамийна.", "Иблисо ша Адамал гӀоле ву аьлла. Цо куралла йина, АллахӀан омра ца дина."],
  ["Адам а, цуьнан зуда Хьава а йалсаманехь бехаш хилла. Царна цигахь шайна лууш долу даар а, малар хилла."],
  ["Амма АллахӀа царна цхьана стоьман дитта тӀе ма гӀо аьлла тӀедиллина."],
  ["ШайтӀано адамаш нийсачу некъа тӀера дӀабаха лаьийна.", "ШайтӀано уьш Ӏехийна. Цара стоьмаш биийра."],
  ["Адам а, Хьава а шайна гӀалат даьлла хилар тӀеийцира.", "Цара АллахӀе шайн гечдар а, къинхетам а барна дийхира."],
  ["АллахӀа Адаман тоба тӀеийцир.", "АллахӀ тоба ТӀеоьцуш Верг а, Къинхетаме Верг а Волун дела."],
  ["АллахӀан омранца Адам а, Хьава а латтахь беха доладелира.", "ГӀалат даьлча, из тӀеэца а, АллахӀе гечдар деха а деза."],
];
export const adamSources = [
  // Name only; no additional plot or interpretation imported from this hadith.
  {label:"СахьихӀ аль-Бухари · 3330", url:"https://sunnah.com/bukhari:3330", pages:[4,7,9]},
  {label:"Къуръан · 51:56", url:"https://quran.com/adh-dhariyat/56", pages:[2]},
  {label:"Къуръан · 3:59", url:"https://quran.com/ali-imran/59", pages:[1,3]},
  {label:"Къуръан · 2:31", url:"https://quran.com/al-baqarah/31", pages:[3]},
  {label:"Къуръан · 7:12–17", url:"https://quran.com/al-araf/12-17", pages:[3,6]},
  {label:"Къуръан · 2:35", url:"https://quran.com/al-baqarah/35", pages:[4,5]},
  {label:"Къуръан · 20:118–119", url:"https://legacy.quran.com/20/118-119", pages:[4]},
  {label:"Къуръан · 7:22–23", url:"https://quran.com/al-araf/22-23", pages:[6,7,9]},
  {label:"Къуръан · 2:36–38", url:"https://quran.com/al-baqarah/36-38", pages:[9]},
  {label:"Къуръан · 2:37", url:"https://quran.com/al-baqarah/37", pages:[8,9]},
  {label:"СахьихӀ аль-Бухари · 4476", url:"https://sunnah.com/bukhari:4476", pages:[1]},
];

// Display names follow the Quran chapter index; references remain derived from
// the editorial sources above, so the printed list cannot omit a cited passage.
const surahNames = {2:"Аль-Бакъара",3:"Али Ӏимран",7:"Аль-АӀраф",20:"ТӀа-ХӀа",51:"Аз-Зарийат"};
export const adamSourceEntries = Object.entries(surahNames).map(([chapter,name])=>({
  name,
  reference:`${chapter}: ${adamSources.filter(source=>source.label.startsWith(`Къуръан · ${chapter}:`)).map(source=>source.label.split(":")[1]).join("; ")}`,
}));
