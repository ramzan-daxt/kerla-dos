"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import SettingsPanel, { defaultSettings, type Settings } from "./settings";
import ScriptText, { latinize } from "./script-text";
import { getWordTranslation } from "./word-translations";
import HomeExtras, { type LearningItem } from "./home-extras";
import AppIcon from "./ui-icon";
type Word = {
  id: string;
  chechen: string;
  russian: string;
  visual: string;
  color?: string;
  example?: string;
  image?: string;
  audioSrc?: string;
};
type Category = {
  id: string;
  title: string;
  russian: string;
  icon: string;
  accent: string;
  words: Word[];
};
type LessonPosition = { categoryId: string; index: number };
const categories: Category[] = [
  {
    id: "family",
    title: "Доьзал а, адамаш а",
    russian: "Семья и люди",
    icon: "👨‍👩‍👧",
    accent: "#f27d5f",
    words: [
      { id: "father", chechen: "Да", russian: "Отец", visual: "👨" },
      { id: "mother", chechen: "Нана", russian: "Мама", visual: "👩" },
      { id: "brother", chechen: "Ваша", russian: "Брат", visual: "👦" },
      { id: "sister", chechen: "Йиша", russian: "Сестра", visual: "👧" },
      { id: "son", chechen: "КӀант", russian: "Сын", visual: "🧒" },
      { id: "daughter", chechen: "ЙоӀ", russian: "Дочь", visual: "👧🏽" },
      { id: "husband", chechen: "Мар", russian: "Муж", visual: "👨🏻" },
      { id: "wife", chechen: "Зуда", russian: "Жена", visual: "👩🏻" },
      {
        id: "grandfather",
        chechen: "Деда",
        russian: "Дедушка по отцу",
        visual: "👴",
      },
      {
        id: "grandmother",
        chechen: "Денана",
        russian: "Бабушка по отцу",
        visual: "👵",
      },
      {
        id: "maternal-grandfather",
        chechen: "Ненада",
        russian: "Дедушка по матери",
        visual: "👴🏽",
      },
      {
        id: "maternal-grandmother",
        chechen: "Ненан нана",
        russian: "Бабушка по матери",
        visual: "👵🏽",
      },
      {
        id: "uncle",
        chechen: "Ден ваша",
        russian: "Дядя по отцу",
        visual: "🧔",
      },
      {
        id: "aunt",
        chechen: "Ден йиша",
        russian: "Тётя по отцу",
        visual: "👩🏽",
      },
    ],
  },
  {
    id: "numbers",
    title: "Терахьаш",
    russian: "Числа",
    icon: "123",
    accent: "#7358ca",
    words: [
      { id: "zero", chechen: "Ноль", russian: "Ноль", visual: "0" },
      { id: "one", chechen: "Цхьаъ", russian: "Один", visual: "1" },
      { id: "two", chechen: "Шиъ", russian: "Два", visual: "2" },
      { id: "three", chechen: "Кхоъ", russian: "Три", visual: "3" },
      { id: "four", chechen: "Диъ", russian: "Четыре", visual: "4" },
      { id: "five", chechen: "Пхиъ", russian: "Пять", visual: "5" },
      { id: "six", chechen: "Ялх", russian: "Шесть", visual: "6" },
      { id: "seven", chechen: "ВорхӀ", russian: "Семь", visual: "7" },
      { id: "eight", chechen: "БархӀ", russian: "Восемь", visual: "8" },
      { id: "nine", chechen: "Исс", russian: "Девять", visual: "9" },
      { id: "ten", chechen: "Итт", russian: "Десять", visual: "10" },
      {
        id: "eleven",
        chechen: "Цхьайтта",
        russian: "Одиннадцать",
        visual: "11",
      },
      { id: "twelve", chechen: "Шийтта", russian: "Двенадцать", visual: "12" },
      {
        id: "thirteen",
        chechen: "Кхойтта",
        russian: "Тринадцать",
        visual: "13",
      },
      {
        id: "fourteen",
        chechen: "Дейтта",
        russian: "Четырнадцать",
        visual: "14",
      },
      {
        id: "fifteen",
        chechen: "Пхийтта",
        russian: "Пятнадцать",
        visual: "15",
      },
    ],
  },
  {
    id: "colors",
    title: "Босаш",
    russian: "Цвета",
    icon: "🎨",
    accent: "#e6ad31",
    words: [
      {
        id: "red",
        chechen: "ЦӀен",
        russian: "Красный",
        visual: "",
        color: "#f05f4f",
      },
      {
        id: "blue",
        chechen: "Сийна",
        russian: "Синий",
        visual: "",
        color: "#4d82db",
      },
      {
        id: "green",
        chechen: "Баьццара",
        russian: "Зелёный",
        visual: "",
        color: "#58a675",
      },
      {
        id: "yellow",
        chechen: "Можа",
        russian: "Жёлтый",
        visual: "",
        color: "#f5c746",
      },
      {
        id: "white",
        chechen: "КӀайн",
        russian: "Белый",
        visual: "",
        color: "#f7f3e9",
      },
      {
        id: "black",
        chechen: "Ӏаьржа",
        russian: "Чёрный",
        visual: "",
        color: "#313532",
      },
      {
        id: "gray",
        chechen: "Чола",
        russian: "Серый",
        visual: "",
        color: "#9ba1a0",
      },
      {
        id: "brown",
        chechen: "Боьмаша",
        russian: "Коричневый",
        visual: "",
        color: "#96613d",
      },
      {
        id: "pink",
        chechen: "Сирла цӀен",
        russian: "Розовый",
        visual: "",
        color: "#ef91b3",
      },
      {
        id: "purple",
        chechen: "ЦӀехо-сийна",
        russian: "Фиолетовый",
        visual: "",
        color: "#8158a8",
      },
      {
        id: "gold",
        chechen: "Дашо бос",
        russian: "Золотой",
        visual: "",
        color: "#dba928",
      },
      {
        id: "light",
        chechen: "Сирла",
        russian: "Светлый",
        visual: "",
        color: "#f5e9b8",
      },
      {
        id: "variegated",
        chechen: "Къорза",
        russian: "Пёстрый",
        visual: "",
        color: "conic-gradient(#f05f4f,#f5c746,#58a675,#4d82db,#f05f4f)",
      },
    ],
  },
  {
    id: "animals",
    title: "Дийнаташ",
    russian: "Животные",
    icon: "🐴",
    accent: "#4d9d85",
    words: [
      { id: "cat", chechen: "Цициг", russian: "Кошка", visual: "🐈" },
      { id: "dog", chechen: "ЖӀаьла", russian: "Собака", visual: "🐕" },
      { id: "horse", chechen: "Говр", russian: "Лошадь", visual: "🐎" },
      { id: "bear", chechen: "Ча", russian: "Медведь", visual: "🐻" },
      { id: "wolf", chechen: "Борз", russian: "Волк", visual: "🐺" },
      { id: "fox", chechen: "Цхьогал", russian: "Лиса", visual: "🦊" },
      { id: "hedgehog", chechen: "Зу", russian: "Ёж", visual: "🦔" },
      { id: "rabbit", chechen: "Пхьагал", russian: "Заяц", visual: "🐇" },
      { id: "deer", chechen: "Сай", russian: "Олень", visual: "🦌" },
      { id: "lion", chechen: "Лом", russian: "Лев", visual: "🦁" },
      { id: "cow", chechen: "Йетт", russian: "Корова", visual: "🐄" },
      { id: "sheep", chechen: "УьстагӀ", russian: "Овца", visual: "🐑" },
      { id: "goat", chechen: "Газа", russian: "Коза", visual: "🐐" },
      { id: "snake", chechen: "Лаьхьа", russian: "Змея", visual: "🐍" },
      { id: "pig", chechen: "Хьакха", russian: "Свинья", visual: "🐖" },
      { id: "donkey", chechen: "Вир", russian: "Осёл", visual: "🫏" },
      { id: "bull", chechen: "Сту", russian: "Бык", visual: "🐂" },
      { id: "calf", chechen: "Эса", russian: "Телёнок", visual: "🐮" },
      { id: "tiger", chechen: "ЦӀоькъа-лом", russian: "Тигр", visual: "🐅" },
      { id: "monkey", chechen: "Маймал", russian: "Обезьяна", visual: "🐒" },
    ],
  },
  {
    id: "body",
    title: "ДегӀан меженаш",
    russian: "Части тела",
    icon: "🖐️",
    accent: "#d86f8e",
    words: [
      { id: "head", chechen: "Корта", russian: "Голова", visual: "🙂" },
      { id: "eye", chechen: "БӀаьрг", russian: "Глаз", visual: "👁️" },
      { id: "ear", chechen: "Лерг", russian: "Ухо", visual: "👂" },
      { id: "nose", chechen: "Мара", russian: "Нос", visual: "👃" },
      { id: "mouth", chechen: "Бага", russian: "Рот", visual: "👄" },
      { id: "tooth", chechen: "Церг", russian: "Зуб", visual: "🦷" },
      { id: "tongue", chechen: "Мотт", russian: "Язык", visual: "👅" },
      { id: "hand", chechen: "Куьг", russian: "Рука", visual: "✋" },
      { id: "foot", chechen: "Ког", russian: "Нога", visual: "🦶" },
      { id: "finger", chechen: "ПӀелг", russian: "Палец", visual: "☝️" },
      { id: "hair", chechen: "Месаш", russian: "Волосы", visual: "💇" },
      { id: "face", chechen: "Юьхь", russian: "Лицо", visual: "😊" },
      { id: "heart", chechen: "Дог", russian: "Сердце", visual: "❤️" },
      { id: "belly", chechen: "Гай", russian: "Живот", visual: "🧍" },
      { id: "back", chechen: "Букъ", russian: "Спина", visual: "🔙" },
      { id: "blood", chechen: "ЦӀий", russian: "Кровь", visual: "🩸" },
      { id: "bone", chechen: "ДаьӀахк", russian: "Кость", visual: "🦴" },
      { id: "skin", chechen: "ЦӀока", russian: "Кожа", visual: "🤚" },
      { id: "nail", chechen: "МӀара", russian: "Ноготь", visual: "💅" },
      { id: "body", chechen: "ДегӀ", russian: "Тело", visual: "🧍‍♂️" },
    ],
  },
  {
    id: "nature",
    title: "Ӏалам",
    russian: "Природа",
    icon: "🌿",
    accent: "#3f91a8",
    words: [
      { id: "sun", chechen: "Малх", russian: "Солнце", visual: "☀️" },
      { id: "moon", chechen: "Бутт", russian: "Луна", visual: "🌙" },
      { id: "star", chechen: "Седа", russian: "Звезда", visual: "⭐" },
      { id: "sky", chechen: "Стигла", russian: "Небо", visual: "🌤️" },
      { id: "water", chechen: "Хи", russian: "Вода", visual: "💧" },
      { id: "mountain", chechen: "Лам", russian: "Гора", visual: "⛰️" },
      { id: "tree", chechen: "Дитт", russian: "Дерево", visual: "🌳" },
      { id: "flower", chechen: "Зезаг", russian: "Цветок", visual: "🌸" },
      { id: "grass", chechen: "Буц", russian: "Трава", visual: "🌱" },
      { id: "snow", chechen: "Ло", russian: "Снег", visual: "❄️" },
      { id: "rain", chechen: "ДогӀа", russian: "Дождь", visual: "🌧️" },
      { id: "wind", chechen: "Мох", russian: "Ветер", visual: "🌬️" },
      { id: "fire", chechen: "ЦӀе", russian: "Огонь", visual: "🔥" },
      { id: "stone", chechen: "ТӀулг", russian: "Камень", visual: "🪨" },
      { id: "earth", chechen: "Латта", russian: "Земля", visual: "🌍" },
      { id: "sea", chechen: "ХӀорд", russian: "Море", visual: "🌊" },
      { id: "cloud", chechen: "Морх", russian: "Облако", visual: "☁️" },
      { id: "forest", chechen: "Хьуьн", russian: "Лес", visual: "🌲" },
      { id: "ice", chechen: "Ша", russian: "Лёд", visual: "🧊" },
      { id: "road", chechen: "Некъ", russian: "Дорога", visual: "🛤️" },
    ],
  },
];
categories.push(
  {
    id: "fruit",
    title: "Стомаш",
    russian: "Фрукты",
    icon: "🍎",
    accent: "#e16c4d",
    words: [
      { id: "apple", chechen: "Ӏаж", russian: "Яблоко", visual: "🍎" },
      { id: "pear", chechen: "Кхор", russian: "Груша", visual: "🍐" },
      { id: "grapes", chechen: "Кемсаш", russian: "Виноград", visual: "🍇" },
      { id: "apricot", chechen: "Куьрк", russian: "Абрикос", visual: "🍑" },
      { id: "plum", chechen: "Хьач", russian: "Слива", visual: "🫐" },
      { id: "mulberry", chechen: "Комар", russian: "Шелковица", visual: "🫐" },
      { id: "watermelon", chechen: "Харбуз", russian: "Арбуз", visual: "🍉" },
      { id: "banana", chechen: "Банан", russian: "Банан", visual: "🍌" },
      { id: "orange", chechen: "Апельсин", russian: "Апельсин", visual: "🍊" },
      { id: "lemon", chechen: "Лимон", russian: "Лимон", visual: "🍋" },
      { id: "peach", chechen: "Шаптал", russian: "Персик", visual: "🍑" },
      { id: "pomegranate", chechen: "Наш", russian: "Гранат", visual: "🔴" },
      {
        id: "strawberry",
        chechen: "Клубника",
        russian: "Клубника",
        visual: "🍓",
      },
      { id: "cherry", chechen: "Вишни", russian: "Вишня", visual: "🍒" },
    ],
  },
  {
    id: "food",
    title: "ЯахӀума",
    russian: "Еда",
    icon: "🍞",
    accent: "#bd7b3d",
    words: [
      { id: "bread", chechen: "Бепиг", russian: "Хлеб", visual: "🍞" },
      { id: "milk", chechen: "Шура", russian: "Молоко", visual: "🥛" },
      { id: "cheese", chechen: "Нехча", russian: "Сыр", visual: "🧀" },
      { id: "meat", chechen: "Жижиг", russian: "Мясо", visual: "🥩" },
      { id: "butter", chechen: "Даьтта", russian: "Масло", visual: "🧈" },
      { id: "honey", chechen: "Моз", russian: "Мёд", visual: "🍯" },
      { id: "salt", chechen: "Туьха", russian: "Соль", visual: "🧂" },
      { id: "water-food", chechen: "Хи", russian: "Вода", visual: "💧" },
      { id: "corn", chechen: "ХьажкӀа", russian: "Кукуруза", visual: "🌽" },
      { id: "cucumber", chechen: "Наьрс", russian: "Огурец", visual: "🥒" },
      { id: "potato", chechen: "Картошка", russian: "Картофель", visual: "🥔" },
      { id: "tomato", chechen: "Помидор", russian: "Помидор", visual: "🍅" },
      { id: "rice", chechen: "Дуга", russian: "Рис", visual: "🍚" },
      { id: "soup", chechen: "Чорпа", russian: "Суп", visual: "🥣" },
    ],
  },
  {
    id: "clothes",
    title: "Духарш",
    russian: "Одежда",
    icon: "👕",
    accent: "#6679c7",
    words: [
      { id: "shirt", chechen: "Коч", russian: "Рубашка", visual: "👕" },
      { id: "trousers", chechen: "Хеча", russian: "Брюки", visual: "👖" },
      { id: "hat", chechen: "Куй", russian: "Шапка", visual: "🧢" },
      { id: "dress", chechen: "ГӀабали", russian: "Платье", visual: "👗" },
      { id: "shoes", chechen: "Мача", russian: "Обувь", visual: "👟" },
      { id: "socks", chechen: "Пезагаш", russian: "Носки", visual: "🧦" },
      { id: "scarf", chechen: "Йовлакх", russian: "Платок", visual: "🧣" },
      { id: "coat", chechen: "Пальто", russian: "Пальто", visual: "🧥" },
      { id: "jacket", chechen: "Куртка", russian: "Куртка", visual: "🧥" },
      { id: "skirt", chechen: "Юбка", russian: "Юбка", visual: "👗" },
      { id: "gloves", chechen: "Перчаткаш", russian: "Перчатки", visual: "🧤" },
      { id: "boots", chechen: "Эчигаш", russian: "Сапоги", visual: "🥾" },
    ],
  },
  {
    id: "school",
    title: "Школа",
    russian: "Школа",
    icon: "🎒",
    accent: "#3996a2",
    words: [
      { id: "book", chechen: "Жайна", russian: "Книга", visual: "📕" },
      { id: "notebook", chechen: "Тептар", russian: "Тетрадь", visual: "📓" },
      { id: "pencil", chechen: "Къолам", russian: "Карандаш", visual: "✏️" },
      { id: "pen", chechen: "Ручка", russian: "Ручка", visual: "🖊️" },
      { id: "teacher", chechen: "Хьехархо", russian: "Учитель", visual: "🧑‍🏫" },
      { id: "student", chechen: "Дешархо", russian: "Ученик", visual: "🧑‍🎓" },
      {
        id: "school-building",
        chechen: "Школа",
        russian: "Школа",
        visual: "🏫",
      },
      { id: "class", chechen: "Класс", russian: "Класс", visual: "🚪" },
      { id: "desk", chechen: "Парта", russian: "Парта", visual: "🪑" },
      { id: "board", chechen: "Доска", russian: "Доска", visual: "🟩" },
      { id: "ruler", chechen: "Линейка", russian: "Линейка", visual: "📏" },
      { id: "scissors", chechen: "ХӀорш", russian: "Ножницы", visual: "✂️" },
      { id: "backpack", chechen: "Рюкзак", russian: "Рюкзак", visual: "🎒" },
      { id: "paint", chechen: "Басарш", russian: "Краски", visual: "🎨" },
    ],
  },
);
categories
  .find((c) => c.id === "family")
  ?.words.push(
    { id: "child", chechen: "Бер", russian: "Ребёнок", visual: "👶" },
    {
      id: "daughter-in-law",
      chechen: "Нус",
      russian: "Невестка",
      visual: "👰",
    },
    { id: "son-in-law", chechen: "Нуц", russian: "Зять", visual: "🤵" },
    { id: "bride", chechen: "Нускал", russian: "Невеста", visual: "👰‍♀️" },
    {
      id: "cousin",
      chechen: "Шича",
      russian: "Двоюродный брат или сестра",
      visual: "🧑",
    },
    { id: "ancestors", chechen: "Дай", russian: "Предки", visual: "👥" },
  );
categories
  .find((c) => c.id === "numbers")
  ?.words.push(
    {
      id: "sixteen",
      chechen: "Ялхийтта",
      russian: "Шестнадцать",
      visual: "16",
    },
    {
      id: "seventeen",
      chechen: "ВорхӀийтта",
      russian: "Семнадцать",
      visual: "17",
    },
    {
      id: "eighteen",
      chechen: "БархӀийтта",
      russian: "Восемнадцать",
      visual: "18",
    },
    {
      id: "nineteen",
      chechen: "Ткъоьсна",
      russian: "Девятнадцать",
      visual: "19",
    },
    { id: "twenty", chechen: "Ткъа", russian: "Двадцать", visual: "20" },
    {
      id: "twenty-one",
      chechen: "Ткъе цхьаъ",
      russian: "Двадцать один",
      visual: "21",
    },
    {
      id: "twenty-two",
      chechen: "Ткъе шиъ",
      russian: "Двадцать два",
      visual: "22",
    },
    {
      id: "twenty-three",
      chechen: "Ткъе кхоъ",
      russian: "Двадцать три",
      visual: "23",
    },
    {
      id: "twenty-four",
      chechen: "Ткъе диъ",
      russian: "Двадцать четыре",
      visual: "24",
    },
    {
      id: "twenty-five",
      chechen: "Ткъе пхиъ",
      russian: "Двадцать пять",
      visual: "25",
    },
    {
      id: "twenty-six",
      chechen: "Ткъе ялх",
      russian: "Двадцать шесть",
      visual: "26",
    },
    {
      id: "twenty-seven",
      chechen: "Ткъе ворхӀ",
      russian: "Двадцать семь",
      visual: "27",
    },
    {
      id: "twenty-eight",
      chechen: "Ткъе бархӀ",
      russian: "Двадцать восемь",
      visual: "28",
    },
    {
      id: "twenty-nine",
      chechen: "Ткъе исс",
      russian: "Двадцать девять",
      visual: "29",
    },
    { id: "thirty", chechen: "Ткъе итт", russian: "Тридцать", visual: "30" },
  );
const numberCategory = categories.find((c) => c.id === "numbers");
if (numberCategory) {
  numberCategory.words = numberCategory.words.filter(
    (w) => Number(w.visual) <= 30,
  );
  numberCategory.words.push(
    { id: "forty", chechen: "Шовзткъа", russian: "Сорок", visual: "40" },
    {
      id: "fifty",
      chechen: "Шовзткъе итт",
      russian: "Пятьдесят",
      visual: "50",
    },
    { id: "sixty", chechen: "Кхузткъа", russian: "Шестьдесят", visual: "60" },
    {
      id: "seventy",
      chechen: "Кхузткъе итт",
      russian: "Семьдесят",
      visual: "70",
    },
    { id: "eighty", chechen: "Дезткъа", russian: "Восемьдесят", visual: "80" },
    {
      id: "ninety",
      chechen: "Дезткъе итт",
      russian: "Девяносто",
      visual: "90",
    },
    { id: "hundred", chechen: "БӀе", russian: "Сто", visual: "100" },
    { id: "thousand", chechen: "Эзар", russian: "Тысяча", visual: "1 000" },
    {
      id: "million",
      chechen: "Миллион",
      russian: "Миллион",
      visual: "1 000 000",
    },
  );
  numberCategory.words.forEach((w) => {
    w.image = `/illustrations/numbers/number-${w.visual.replace(/\s/g, "")}.png`;
  });
}
const fruitAndVegetables = categories.find((c) => c.id === "fruit");
if (fruitAndVegetables) {
  fruitAndVegetables.title = "Стоьмаш а, хастоьмаш";
  fruitAndVegetables.russian = "Фрукты и овощи";
  fruitAndVegetables.icon = "🍎";
  fruitAndVegetables.words.push(
    {
      id: "corn-vegetable",
      chechen: "ХьажкӀа",
      russian: "Кукуруза",
      visual: "🌽",
    },
    {
      id: "cucumber-vegetable",
      chechen: "Наьрс",
      russian: "Огурец",
      visual: "🥒",
    },
    {
      id: "potato-vegetable",
      chechen: "Картошка",
      russian: "Картофель",
      visual: "🥔",
    },
    {
      id: "tomato-vegetable",
      chechen: "Помидор",
      russian: "Помидор",
      visual: "🍅",
    },
    { id: "pepper", chechen: "Бурч", russian: "Перец", visual: "🫑" },
    { id: "onion", chechen: "ЦӀенна", russian: "Лук", visual: "🧅" },
  );
}
const foodCategory = categories.find((c) => c.id === "food");
if (foodCategory)
  foodCategory.words = foodCategory.words.filter(
    (w) => !["corn", "cucumber", "potato", "tomato"].includes(w.id),
  );
categories.push(
  {
    id: "home",
    title: "ЦӀа",
    russian: "Дом",
    icon: "🏠",
    accent: "#b36f55",
    words: [
      { id: "house", chechen: "ЦӀа", russian: "Дом", visual: "🏠" },
      { id: "door", chechen: "НеӀ", russian: "Дверь", visual: "🚪" },
      { id: "window", chechen: "Кор", russian: "Окно", visual: "🪟" },
      { id: "roof", chechen: "Тхов", russian: "Крыша", visual: "🏡" },
      { id: "wall", chechen: "Пен", russian: "Стена", visual: "🧱" },
      { id: "room", chechen: "Чоь", russian: "Комната", visual: "🛋️" },
      { id: "table", chechen: "Истол", russian: "Стол", visual: "🪑" },
      { id: "chair", chechen: "ГӀант", russian: "Стул", visual: "🪑" },
      { id: "bed", chechen: "Маьнга", russian: "Кровать", visual: "🛏️" },
      { id: "closet", chechen: "Шкаф", russian: "Шкаф", visual: "🚪" },
      { id: "lamp", chechen: "Лампа", russian: "Лампа", visual: "💡" },
      {
        id: "television",
        chechen: "Телевизор",
        russian: "Телевизор",
        visual: "📺",
      },
      {
        id: "fridge",
        chechen: "Холодильник",
        russian: "Холодильник",
        visual: "🧊",
      },
      { id: "key", chechen: "ДӀаьхкаш", russian: "Ключи", visual: "🔑" },
    ],
  },
  {
    id: "transport",
    title: "Транспорт",
    russian: "Транспорт",
    icon: "🚗",
    accent: "#527db4",
    words: [
      { id: "car", chechen: "Машина", russian: "Машина", visual: "🚗" },
      { id: "bus", chechen: "Автобус", russian: "Автобус", visual: "🚌" },
      { id: "train", chechen: "Поезд", russian: "Поезд", visual: "🚆" },
      { id: "plane", chechen: "Самолёт", russian: "Самолёт", visual: "✈️" },
      {
        id: "bicycle",
        chechen: "Велосипед",
        russian: "Велосипед",
        visual: "🚲",
      },
      { id: "ship", chechen: "Кема", russian: "Корабль", visual: "🚢" },
      {
        id: "motorcycle",
        chechen: "Мотоцикл",
        russian: "Мотоцикл",
        visual: "🏍️",
      },
      { id: "taxi", chechen: "Такси", russian: "Такси", visual: "🚕" },
      { id: "tractor", chechen: "Трактор", russian: "Трактор", visual: "🚜" },
      {
        id: "helicopter",
        chechen: "Вертолёт",
        russian: "Вертолёт",
        visual: "🚁",
      },
      { id: "tram", chechen: "Трамвай", russian: "Трамвай", visual: "🚋" },
      {
        id: "truck",
        chechen: "Йоккха машина",
        russian: "Грузовик",
        visual: "🚚",
      },
      { id: "rocket", chechen: "Ракета", russian: "Ракета", visual: "🚀" },
      { id: "scooter", chechen: "Самокат", russian: "Самокат", visual: "🛴" },
    ],
  },
  {
    id: "time",
    title: "Хан",
    russian: "Время",
    icon: "⏰",
    accent: "#8b67b1",
    words: [
      { id: "morning", chechen: "Ӏуьйре", russian: "Утро", visual: "🌅" },
      { id: "day", chechen: "Де", russian: "День", visual: "☀️" },
      { id: "evening", chechen: "Суьйре", russian: "Вечер", visual: "🌇" },
      { id: "night", chechen: "Буьйса", russian: "Ночь", visual: "🌙" },
      { id: "today", chechen: "Тахана", russian: "Сегодня", visual: "📅" },
      { id: "tomorrow", chechen: "Кхана", russian: "Завтра", visual: "➡️" },
      { id: "yesterday", chechen: "Селхана", russian: "Вчера", visual: "⬅️" },
      { id: "year", chechen: "Шо", russian: "Год", visual: "🗓️" },
      { id: "month", chechen: "Бутт", russian: "Месяц", visual: "🌙" },
      { id: "week", chechen: "КӀира", russian: "Неделя", visual: "📆" },
      { id: "hour", chechen: "Сахьт", russian: "Час", visual: "🕐" },
      { id: "minute", chechen: "Минот", russian: "Минута", visual: "⏱️" },
      { id: "early", chechen: "Хьалха", russian: "Рано", visual: "🌄" },
      { id: "late", chechen: "ТӀаьхьа", russian: "Поздно", visual: "🌃" },
    ],
  },
);
const alphabetExamples: [string, string, string, string][] = [
  ["А а", "адам", "🧍", "человек"],
  ["Аь аь", "аьрзу", "🦅", "орёл"],
  ["Б б", "борз", "🐺", "волк"],
  ["В в", "ваша", "👦", "брат"],
  ["Г г", "говр", "🐎", "лошадь"],
  ["ГӀ гӀ", "гӀала", "🏙️", "город"],
  ["Д д", "да", "👨", "отец"],
  ["Е е", "йетт", "🐄", "корова"],
  ["Ж ж", "жижиг", "🥩", "мясо"],
  ["З з", "зезаг", "🌸", "цветок"],
  ["И и", "шун", "🪑", "стол"],
  ["Й й", "йиша", "👧", "сестра"],
  ["К к", "кор", "🪟", "окно"],
  ["Кх кх", "кхор", "🍐", "груша"],
  ["Къ къ", "къолам", "✏️", "карандаш"],
  ["КӀ кӀ", "кӀант", "🧒", "сын"],
  ["Л л", "лам", "⛰️", "гора"],
  ["М м", "малх", "☀️", "солнце"],
  ["Н н", "нана", "👩", "мама"],
  ["О о", "олхазар", "🐦", "птица"],
  ["Оь оь", "оьпа", "🐿️", "суслик"],
  ["П п", "пен", "🧱", "стена"],
  ["ПӀ пӀ", "пӀелг", "☝️", "палец"],
  ["Р р", "руьйта", "💧", "водопой"],
  ["С с", "седа", "⭐", "звезда"],
  ["Т т", "тхов", "🏠", "крыша"],
  ["ТӀ тӀ", "тӀулг", "🪨", "камень"],
  ["У у", "урам", "🛣️", "улица"],
  ["Уь уь", "уьстагӀ", "🐑", "овца"],
  ["Х х", "хи", "💧", "вода"],
  ["Хь хь", "хьач", "🫐", "слива"],
  ["ХӀ хӀ", "хӀаваъ", "🌬️", "воздух; атмосфера"],
  ["Ц ц", "цициг", "🐈", "кошка"],
  ["ЦӀ цӀ", "цӀа", "🏠", "дом"],
  ["Ч ч", "ча", "🐻", "медведь"],
  ["ЧӀ чӀ", "чӀара", "🐟", "рыба"],
  ["Ш ш", "шура", "🥛", "молоко"],
  ["Ъ ъ", "шиъ", "2️⃣", "два"],
  ["Ь ь", "туьйра", "📖", "сказка"],
  ["Э э", "эса", "🐮", "телёнок"],
  ["Йу йу", "йурт", "🏘️", "село"],
  ["Йуь йуь", "йуьхь", "🙂", "лицо"],
  ["Йа йа", "йаздархо", "✍️", "писатель"],
  ["Ӏ ӏ", "Ӏаж", "🍎", "яблоко"],
];
const alphabetImages: Record<string, string> = {
  адам: "/illustrations/alphabet/person.png",
  аьрзу: "/illustrations/alphabet/eagle.png",
  борз: "/illustrations/animals/wolf.png",
  ваша: "/illustrations/family/brother.png",
  говр: "/illustrations/animals/horse.png",
  гӀала: "/illustrations/alphabet/city.png",
  да: "/illustrations/family/father.png",
  йетт: "/illustrations/animals/cow.png",
  жижиг: "/illustrations/alphabet/meat.png",
  зезаг: "/illustrations/alphabet/flower.png",
  шун: "/illustrations/alphabet/table.png",
  йиша: "/illustrations/family/sister.png",
  кор: "/illustrations/alphabet/window.png",
  кхор: "/illustrations/alphabet/pear.png",
  къолам: "/illustrations/alphabet/pencil.png",
  кӀант: "/illustrations/family/son.png",
  лам: "/illustrations/alphabet/mountain.png",
  малх: "/illustrations/alphabet/sun.png",
  нана: "/illustrations/family/mother.png",
  олхазар: "/illustrations/alphabet/bird.png",
  оьпа: "/illustrations/alphabet/ground-squirrel.png",
  пен: "/illustrations/alphabet/wall.png",
  пӀелг: "/illustrations/alphabet/finger.png",
  руьйта: "/illustrations/alphabet/watering-place.png",
  седа: "/illustrations/alphabet/star.png",
  тхов: "/illustrations/alphabet/roof.png",
  тӀулг: "/illustrations/alphabet/stone.png",
  урам: "/illustrations/alphabet/street.png",
  уьстагӀ: "/illustrations/animals/sheep.png",
  хи: "/illustrations/alphabet/water.png",
  хьач: "/illustrations/alphabet/plums.png",
  хӀаваъ: "/illustrations/alphabet/air.png",
  цициг: "/illustrations/animals/cat.png",
  цӀа: "/illustrations/alphabet/house.png",
  ча: "/illustrations/animals/bear.png",
  чӀара: "/illustrations/alphabet/fish.png",
  шура: "/illustrations/alphabet/milk.png",
  шиъ: "/illustrations/alphabet/two.png",
  туьйра: "/illustrations/alphabet/fairytale.png",
  эса: "/illustrations/animals/calf.png",
  йурт: "/illustrations/alphabet/village.png",
  йуьхь: "/illustrations/alphabet/face.png",
  йаздархо: "/illustrations/alphabet/writer.png",
  Ӏаж: "/illustrations/alphabet/apple.png",
};
categories.push({
  id: "alphabet",
  title: "Абат",
  russian: "Чеченский алфавит",
  icon: "Аь",
  accent: "#ee795b",
  words: alphabetExamples.map(([letter, example, visual, russian], i) => ({
    id: `letter-${i + 1}`,
    chechen: letter,
    russian,
    visual,
    example,
    image: `/illustrations/alphabet/cards/letter-${i + 1}.png?v=4`,
  })),
});
const recordedAudioByWord = new Map<string, string>();
const recordedCategoryIds = new Set(["family", "colors", "animals"]);
categories.forEach((category) => {
  if (!recordedCategoryIds.has(category.id)) return;
  category.words.forEach((word) => {
    word.audioSrc = `/audio/${category.id}/${word.id}.wav`;
    recordedAudioByWord.set(word.chechen.toLocaleLowerCase(), word.audioSrc);
  });
});
categories.forEach((category) =>
  category.words.forEach((word) => {
    const spokenWord = category.id === "alphabet" ? word.example : word.chechen;
    word.audioSrc ||= recordedAudioByWord.get(
      (spokenWord || "").toLocaleLowerCase(),
    );
  }),
);
const categoryIcons: Record<string, string> = {
  alphabet: "/icons/categories/alphabet.png",
  numbers: "/icons/categories/numbers.png",
  family: "/icons/categories/family.png",
  colors: "/icons/categories/colors.png",
  animals: "/icons/categories/animals.png",
  body: "/icons/categories/body.png",
  nature: "/icons/categories/nature.png",
  fruit: "/icons/categories/fruit.png",
  food: "/icons/categories/food.png",
  clothes: "/icons/categories/clothes.png",
  school: "/icons/categories/school.png",
  home: "/icons/categories/home.png",
  transport: "/icons/categories/transport.png",
  time: "/icons/categories/time.png",
};
categories.forEach((category) => {
  category.icon = categoryIcons[category.id] || category.icon;
});
const alphabetCategory = categories.find((c) => c.id === "alphabet")!;
const freeCategoryIds = new Set([
  "alphabet",
  "numbers",
  "family",
  "colors",
  "animals",
]);
const illustratedWords: Record<string, string> = {
  "family:father": "/illustrations/family/father.png",
  "family:mother": "/illustrations/family/mother.png",
  "family:child": "/illustrations/family/child.png",
  "family:brother": "/illustrations/family/brother.png",
  "family:sister": "/illustrations/family/sister.png",
  "family:son": "/illustrations/family/son.png",
  "family:daughter": "/illustrations/family/daughter.png",
  "family:husband": "/illustrations/family/husband.png",
  "family:wife": "/illustrations/family/wife.png",
  "family:grandfather": "/illustrations/family/grandfather.png",
  "family:grandmother": "/illustrations/family/grandmother.png",
  "family:maternal-grandfather":
    "/illustrations/family/maternal-grandfather.png",
  "family:maternal-grandmother":
    "/illustrations/family/maternal-grandmother.png?v=2",
  "family:uncle": "/illustrations/family/uncle.png",
  "family:aunt": "/illustrations/family/aunt.png",
  "family:daughter-in-law": "/illustrations/family/daughter-in-law.png",
  "family:son-in-law": "/illustrations/family/son-in-law.png",
  "family:bride": "/illustrations/family/bride.png",
  "family:cousin": "/illustrations/family/cousin.png",
  "family:ancestors": "/illustrations/family/ancestors-v2.png",
  "colors:red": "/illustrations/colors/red.png",
  "colors:blue": "/illustrations/colors/blue.png",
  "colors:green": "/illustrations/colors/green.png",
  "colors:yellow": "/illustrations/colors/yellow.png",
  "colors:white": "/illustrations/colors/white.png",
  "colors:black": "/illustrations/colors/black.png",
  "colors:gray": "/illustrations/colors/gray.png",
  "colors:brown": "/illustrations/colors/brown.png",
  "colors:pink": "/illustrations/colors/pink.png",
  "colors:purple": "/illustrations/colors/purple.png",
  "colors:gold": "/illustrations/colors/gold.png",
  "colors:light": "/illustrations/colors/light.png",
  "colors:variegated": "/illustrations/colors/variegated.png",
  "animals:cat": "/illustrations/animals/cat.png",
  "animals:dog": "/illustrations/animals/dog.png",
  "animals:horse": "/illustrations/animals/horse.png",
  "animals:bear": "/illustrations/animals/bear.png",
  "animals:wolf": "/illustrations/animals/wolf.png",
  "animals:fox": "/illustrations/animals/fox.png",
  "animals:hedgehog": "/illustrations/animals/hedgehog.png",
  "animals:rabbit": "/illustrations/animals/rabbit.png",
  "animals:deer": "/illustrations/animals/deer.png",
  "animals:lion": "/illustrations/animals/lion.png",
  "animals:cow": "/illustrations/animals/cow.png",
  "animals:sheep": "/illustrations/animals/sheep.png",
  "animals:goat": "/illustrations/animals/goat.png",
  "animals:snake": "/illustrations/animals/snake.png",
  "animals:pig": "/illustrations/animals/pig.png",
  "animals:donkey": "/illustrations/animals/donkey.png",
  "animals:bull": "/illustrations/animals/bull.png",
  "animals:calf": "/illustrations/animals/calf.png",
  "animals:tiger": "/illustrations/animals/tiger.png",
  "animals:monkey": "/illustrations/animals/monkey.png",
  "body:head": "/illustrations/body/head.png",
  "body:eye": "/illustrations/body/eye.png",
  "body:ear": "/illustrations/body/ear.png",
  "body:nose": "/illustrations/body/nose.png",
  "body:mouth": "/illustrations/body/mouth.png",
  "body:tooth": "/illustrations/body/tooth.png",
  "body:tongue": "/illustrations/body/tongue.png",
  "body:hand": "/illustrations/body/hand.png",
  "body:foot": "/illustrations/body/foot.png",
  "body:finger": "/illustrations/alphabet/finger.png",
  "body:hair": "/illustrations/body/hair.png",
  "body:face": "/illustrations/alphabet/face.png",
  "body:heart": "/illustrations/body/heart.png",
  "body:belly": "/illustrations/body/belly.png",
  "body:back": "/illustrations/body/back.png",
  "body:blood": "/illustrations/body/blood.png",
  "body:bone": "/illustrations/body/bone.png",
  "body:skin": "/illustrations/body/skin.png",
  "body:nail": "/illustrations/body/nail.png",
  "body:body": "/illustrations/body/body-full.png",
};
categories.forEach((category) =>
  category.words.forEach((word) => {
    word.image = illustratedWords[`${category.id}:${word.id}`] || word.image;
  }),
);
function LockedWords({ words }: { words: Word[] }) {
  return (
    <div className="locked-word-grid">
      {words.map((w) => (
        <div key={w.id}>
          <span>
            {w.color ? (
              <i style={{ background: w.color }} />
            ) : (
              <b>{w.visual}</b>
            )}
          </span>
          <em>
            <AppIcon name="lock" />
          </em>
        </div>
      ))}
    </div>
  );
}
function AlphabetWord({ word, letter }: { word: string; letter: string }) {
  const at = word.toLocaleLowerCase().indexOf(letter.toLocaleLowerCase());
  if (at <= 0) return <>{word}</>;
  return (
    <>
      {word.slice(0, at)}
      <mark className="letter-in-word">
        {word.slice(at, at + letter.length)}
      </mark>
      {word.slice(at + letter.length)}
    </>
  );
}
function NumberIllustration({ value }: { value: string }) {
  const plain = value.replace(/\s/g, "");
  const n = Number(plain);
  const hue =
    n <= 10
      ? n * 33
      : n < 30
        ? 135
        : n === 30
          ? 175
          : n <= 90
            ? 175 + (n - 30) * 2
            : n === 100
              ? 310
              : n === 1000
                ? 80
                : 245;
  return (
    <div
      className={`number-illustration ${plain.length > 3 ? "very-long-number" : plain.length > 2 ? "long-number" : ""}`}
      style={{ "--number-hue": `${hue}deg` } as React.CSSProperties}
    >
      {[...plain].map((digit, i) => (
        <img
          key={`${digit}-${i}`}
          src={`/illustrations/numbers/${digit}.png`}
          alt=""
          draggable={false}
        />
      ))}
    </div>
  );
}
export default function Home() {
  const [active, setActive] = useState<Category | null>(null),
    [mode, setMode] = useState<"learn" | "game">("learn"),
    [index, setIndex] = useState(0),
    [stars, setStars] = useState(0),
    [round, setRound] = useState(0),
    [answer, setAnswer] = useState<"idle" | "right" | "wrong">("idle"),
    [selected, setSelected] = useState<Word | null>(null),
    [premium, setPremium] = useState(false),
    [paywall, setPaywall] = useState(false),
    [muted, setMuted] = useState(false),
    [settingsOpen, setSettingsOpen] = useState(false),
    [settings, setSettings] = useState<Settings>(defaultSettings),
    [homeView, setHomeView] = useState<
      "categories" | "random" | "favorites" | "stories" | "games" | null
    >(null),
    [favorites, setFavorites] = useState<string[]>([]),
    [lastLesson, setLastLesson] = useState<LessonPosition | null>(null),
    [seenWords, setSeenWords] = useState<string[]>([]),
    [cardMotion, setCardMotion] = useState<
      "idle" | "out-left" | "out-right" | "in-left" | "in-right"
    >("idle"),
    [cardDrag, setCardDrag] = useState(0),
    [cardExitOrigin, setCardExitOrigin] = useState(0),
    [cardDragging, setCardDragging] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);
  const swipeStart = useRef<{
    x: number;
    y: number;
    pointerId: number;
  } | null>(null);
  const swipeHandled = useRef(false);
  const motionLocked = useRef(false);
  const motionPhase = useRef<"idle" | "out" | "in">("idle");
  const motionDirection = useRef<-1 | 1>(1);
  const indexRef = useRef(0);
  const cardTimers = useRef<number[]>([]);
  useEffect(() => {
    const s = localStorage.getItem("kerla-stars");
    if (s) setStars(Number(s));
    setPremium(localStorage.getItem("kerla-premium-v2") === "yes");
    const saved = localStorage.getItem("kerla-settings");
    if (saved)
      try {
        const next = { ...defaultSettings, ...JSON.parse(saved) };
        next.script = "cyrillic";
        if (!localStorage.getItem("kerla-autospeak-v2")) next.autoSpeak = true;
        setSettings(next);
      } catch {}
    if (!localStorage.getItem("kerla-autospeak-v2"))
      localStorage.setItem("kerla-autospeak-v2", "yes");
    const fav = localStorage.getItem("kerla-favorites");
    if (fav)
      try {
        setFavorites(JSON.parse(fav));
      } catch {}
    const savedLesson = localStorage.getItem("kerla-last-lesson");
    if (savedLesson)
      try {
        setLastLesson(JSON.parse(savedLesson));
      } catch {}
    const seen = localStorage.getItem("kerla-seen-words");
    if (seen)
      try {
        setSeenWords(JSON.parse(seen));
      } catch {}
  }, []);
  useEffect(() => {
    document.body.classList.toggle("premium-open", premium);
    document.body.classList.toggle("large-text", settings.largeText);
    document.body.classList.toggle("reduce-motion", settings.reduceMotion);
    localStorage.setItem("kerla-settings", JSON.stringify(settings));
  }, [premium, settings]);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [active?.id, homeView]);
  const available =
    active && (premium || freeCategoryIds.has(active.id)) ? active.words : [];
  const target = available[round % (available.length || 1)];
  const options = useMemo(() => {
    if (!active || !target) return [];
    return [
      target,
      ...available
        .filter((w) => w.id !== target.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, settings.difficulty - 1),
    ].sort(() => 0.5 - Math.random());
  }, [active, target?.id, round, premium, settings.difficulty]);
  const tx = (s: string) => s;
  function saveSettings(v: Settings) {
    setSettings(v);
    localStorage.setItem("kerla-settings", JSON.stringify(v));
  }
  function speak(w: Word) {
    if (muted || !active) return;
    audio.current?.pause();
    const clip = new Audio(
      w.audioSrc || "/audio/" + active.id + "/" + w.id + ".wav",
    );
    clip.volume = settings.volume;
    audio.current = clip;
    clip.play().catch(() => {
      if ("speechSynthesis" in window) {
        speechSynthesis.cancel();
        const say = () => {
          const u = new SpeechSynthesisUtterance(
            w.example ? `${w.chechen}. ${w.example}` : w.chechen,
          );
          u.lang = "ru-RU";
          u.rate = settings.rate;
          u.volume = settings.volume;
          speechSynthesis.speak(u);
          if (settings.repeat) {
            u.onend = () => {
              const again = new SpeechSynthesisUtterance(
                w.example || w.chechen,
              );
              again.rate = settings.rate;
              again.volume = settings.volume;
              speechSynthesis.speak(again);
            };
          }
        };
        say();
      }
    });
  }
  function speakAlphabetPart(w: Word, part: "letter" | "word") {
    if (muted) return;
    audio.current?.pause();
    speechSynthesis.cancel();
    const text =
      part === "letter" ? w.chechen.split(" ")[0] : w.example || w.chechen;
    const clip = new Audio(
      part === "word" && w.audioSrc
        ? w.audioSrc
        : `/audio/alphabet/${w.id}-${part}.mp3`,
    );
    clip.volume = settings.volume;
    audio.current = clip;
    clip.play().catch(() => {
      if ("speechSynthesis" in window) {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "ru-RU";
        u.rate = settings.rate;
        u.volume = settings.volume;
        speechSynthesis.speak(u);
        if (settings.repeat)
          u.onend = () => {
            const again = new SpeechSynthesisUtterance(text);
            again.lang = "ru-RU";
            again.rate = settings.rate;
            again.volume = settings.volume;
            speechSynthesis.speak(again);
          };
      }
    });
  }
  function open(cat: Category, resumeAt?: number) {
    setHomeView(null);
    setActive(cat);
    setMode("learn");
    setIndex(
      resumeAt !== undefined
        ? Math.min(Math.max(resumeAt, 0), cat.words.length - 1)
        : 0,
    );
    setRound(0);
    setAnswer("idle");
    setSelected(null);
  }
  function clearCardTimers() {
    cardTimers.current.forEach((timer) => window.clearTimeout(timer));
    cardTimers.current = [];
  }
  function finishCardEnter() {
    if (!active || motionPhase.current !== "in") return;
    clearCardTimers();
    motionPhase.current = "idle";
    setCardMotion("idle");
    setCardExitOrigin(0);
    motionLocked.current = false;
    if (settings.autoSpeak) {
      const nextWord = active.words[indexRef.current];
      active.id === "alphabet"
        ? speakAlphabetPart(nextWord, "letter")
        : speak(nextWord);
    }
  }
  function finishCardExit() {
    if (!active || motionPhase.current !== "out") return;
    clearCardTimers();
    const direction = motionDirection.current;
    const nextIndex =
      direction > 0
        ? (indexRef.current + 1) % active.words.length
        : indexRef.current === 0
          ? active.words.length - 1
          : indexRef.current - 1;
    indexRef.current = nextIndex;
    setIndex(nextIndex);
    motionPhase.current = "in";
    setCardMotion(direction > 0 ? "in-right" : "in-left");
    cardTimers.current.push(window.setTimeout(finishCardEnter, 500));
  }
  function moveCard(direction: -1 | 1) {
    if (!active || motionLocked.current) return;
    clearCardTimers();
    if (
      settings.reduceMotion ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const nextIndex =
        direction > 0
          ? (indexRef.current + 1) % active.words.length
          : indexRef.current === 0
            ? active.words.length - 1
            : indexRef.current - 1;
      indexRef.current = nextIndex;
      setIndex(nextIndex);
      setCardDrag(0);
      setCardExitOrigin(0);
      return;
    }
    motionLocked.current = true;
    motionPhase.current = "out";
    motionDirection.current = direction;
    setCardMotion(direction > 0 ? "out-left" : "out-right");
    cardTimers.current.push(window.setTimeout(finishCardExit, 500));
  }
  function choose(w: Word) {
    if (answer !== "right") {
      setSelected(w);
      setAnswer("idle");
    }
  }
  function gameTone(ok: boolean) {
    if (!settings.gameSounds) return;
    try {
      const Ctx = window.AudioContext,
        ctx = new Ctx(),
        osc = ctx.createOscillator(),
        gain = ctx.createGain();
      osc.frequency.value = ok ? 660 : 220;
      gain.gain.value = 0.06;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.stop(ctx.currentTime + 0.23);
    } catch {}
  }
  function check() {
    if (!selected || !target) return;
    if (selected.id === target.id) {
      setAnswer("right");
      gameTone(true);
      speak(target);
      const n = stars + 1;
      setStars(n);
      localStorage.setItem("kerla-stars", String(n));
    } else {
      setAnswer("wrong");
      gameTone(false);
    }
  }
  function next() {
    setRound((r) => r + 1);
    setSelected(null);
    setAnswer("idle");
  }
  function unlock() {
    localStorage.setItem("kerla-premium-v2", "yes");
    setPremium(true);
    setPaywall(false);
  }
  useEffect(() => {
    if (settings.autoSpeak && active && !motionLocked.current) {
      const word = active.words[index];
      active.id === "alphabet"
        ? speakAlphabetPart(word, "letter")
        : speak(word);
    }
  }, [active?.id, index, settings.autoSpeak]);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);
  useEffect(() => {
    if (!active) return;
    const position = { categoryId: active.id, index };
    setLastLesson(position);
    localStorage.setItem("kerla-last-lesson", JSON.stringify(position));
    const word = active.words[index];
    if (!word) return;
    const key = `${active.id}:${word.id}`;
    setSeenWords((current) => {
      if (current.includes(key)) return current;
      const next = [...current, key];
      localStorage.setItem("kerla-seen-words", JSON.stringify(next));
      return next;
    });
  }, [active?.id, index]);
  useEffect(() => {
    function handleCardKeys(event: KeyboardEvent) {
      if (!active || mode !== "learn") return;
      if (event.key === "ArrowLeft") moveCard(-1);
      if (event.key === "ArrowRight") moveCard(1);
    }
    window.addEventListener("keydown", handleCardKeys);
    return () => window.removeEventListener("keydown", handleCardKeys);
  }, [active?.id, mode]);
  useEffect(
    () => () => {
      cardTimers.current.forEach((timer) => window.clearTimeout(timer));
      cardTimers.current = [];
    },
    [],
  );
  const learningItems: LearningItem[] = categories
    .filter(
      (c) => c.id !== "alphabet" && (premium || freeCategoryIds.has(c.id)),
    )
    .flatMap((c) =>
      c.words.map((w) => ({
        key: `${c.id}:${w.id}`,
        word: tx(w.chechen),
        visual: w.visual,
        category: tx(c.title),
        color: w.color,
        image: w.image,
        audioSrc: w.audioSrc,
      })),
    );
  function toggleFavorite(key: string) {
    setFavorites((current) => {
      const next = current.includes(key)
        ? current.filter((x) => x !== key)
        : [...current, key];
      localStorage.setItem("kerla-favorites", JSON.stringify(next));
      return next;
    });
  }
  const resumeCategory =
    categories.find((category) => category.id === lastLesson?.categoryId) ||
    alphabetCategory;
  const resumeIndex = Math.min(
    lastLesson?.index || 0,
    resumeCategory.words.length - 1,
  );
  if (homeView === "categories")
    return (
      <ScriptText latin={false}>
        <main className="category-library">
          <header>
            <button
              className="back icon-label"
              onClick={() => setHomeView(null)}
            >
              <AppIcon name="arrow-left" /> <span>Коьртачу агӀор</span>
            </button>
            <a className="brand" onClick={() => setHomeView(null)}>
              KERLA <i>DOŞ</i>
            </a>
            <div className="stars icon-label">
              {stars} <AppIcon name="star" />
            </div>
          </header>
          <section className="category-library-head">
            <h1>ДЕШНИЙН ТОБАНАШ</h1>
          </section>
          <section className="category-library-grid">
            {categories
              .filter((cat) => cat.id !== "alphabet" && cat.id !== "numbers")
              .map((cat) => (
                <button
                  className={
                    "category-tile " +
                    (!freeCategoryIds.has(cat.id) && !premium
                      ? "paid-topic"
                      : "")
                  }
                  key={cat.id}
                  style={{ "--card": cat.accent } as React.CSSProperties}
                  onClick={() => open(cat)}
                >
                  <span className="category-tile-art">
                    <img
                      src={`/icons/categories/cards/${cat.id}.png`}
                      alt=""
                      draggable={false}
                    />
                    {!freeCategoryIds.has(cat.id) && !premium && (
                      <i>
                        <AppIcon name="lock" />
                      </i>
                    )}
                  </span>
                  <span className="category-tile-copy">
                    <strong>{tx(cat.title)}</strong>
                    <small>{cat.words.length} дош</small>
                  </span>
                </button>
              ))}
          </section>
        </main>
      </ScriptText>
    );
  if (homeView)
    return (
      <HomeExtras
        view={homeView}
        items={learningItems}
        favorites={favorites}
        onFavorite={toggleFavorite}
        onBack={() => setHomeView(null)}
        rate={settings.rate}
        volume={settings.volume}
        latin={false}
        premium={premium}
      />
    );
  if (active && !freeCategoryIds.has(active.id) && !premium) {
    return (
      <ScriptText latin={false}>
        <main className="app-shell category-gate">
          <header>
            <button className="back icon-label" onClick={() => setActive(null)}>
              <AppIcon name="arrow-left" /> <span>Коьртачу агӀор</span>
            </button>
            <a className="brand" onClick={() => setActive(null)}>
              KERLA <i>DOŞ</i>
            </a>
            <div className="stars icon-label">
              {stars} <AppIcon name="star" />
            </div>
          </header>
          <section className="locked-topic universal-paywall">
            <div className="locked-topic-icon">
              <AppIcon name="lock" />
              <i>
                <AppIcon name="sparkle" />
              </i>
            </div>
            <small>KERLA DOŞ</small>
            <h1>Массо категореш дӀайоьлла</h1>
            <p>
              ДӀаэцар дича, кху а, кхечу а категорешкахь долу массо дешнаш
              дӀайоьллу.
            </p>
            <strong>2,99 €</strong>
            <span>Цкъа бен мах ца бо · массо приложенин таронаш</span>
            <button className="buy-button" onClick={unlock}>
              Приложени дӀаэца
            </button>
          </section>
        </main>
      </ScriptText>
    );
  }
  if (active) {
    const current = active.words[index];
    const letterForms = tx(current.chechen).split(" ");
    return (
      <ScriptText latin={false}>
        <main className="app-shell">
          <header>
            <button className="back icon-label" onClick={() => setActive(null)}>
              <AppIcon name="arrow-left" /> <span>Коьртачу агӀор</span>
            </button>
            <a className="brand" onClick={() => setActive(null)}>
              KERLA <i>DOŞ</i>
            </a>
            <button
              className="sound"
              onClick={() => setMuted(!muted)}
              aria-label={muted ? "Аз дӀайолаяйта" : "Аз дӀайаккха"}
            >
              <AppIcon name={muted ? "mute" : "sound"} />
            </button>
          </header>
          <section
            className="lesson-head"
            style={{ "--accent": active.accent } as React.CSSProperties}
          >
            <div className="topic-icon">
              <img src={active.icon} alt="" draggable={false} />
            </div>
            <div>
              <h1>{tx(active.title)}</h1>
              <small>{active.words.length} дош</small>
            </div>
            <div className="stars icon-label">
              {stars} <AppIcon name="star" />
            </div>
          </section>
          <nav className="modes">
            <button
              className={mode === "learn" ? "active" : ""}
              onClick={() => setMode("learn")}
            >
              <span className="icon-label">
                <AppIcon name="book" /> Ӏамо
              </span>
            </button>
            <button
              className={mode === "game" ? "active" : ""}
              onClick={() => {
                setMode("game");
                setAnswer("idle");
                setSelected(null);
              }}
            >
              <span className="icon-label">
                <AppIcon name="target" /> Ловза
              </span>
            </button>
          </nav>
          {mode === "learn" ? (
            <section className="learn-area">
              <div
                className={`card-stage ${active.id === "alphabet" ? "alphabet-stage" : ""}`}
              >
                <div
                  key={`${active.id}:${current.id}:${cardMotion.startsWith("in-") ? "incoming" : "current"}`}
                  className={`big-card ${active.id === "alphabet" ? "alphabet-card" : ""} card-motion-${cardMotion}${cardDragging ? " card-dragging" : ""}`}
                  style={
                    {
                      "--accent": active.accent,
                      "--card-exit-origin": `${cardExitOrigin}px`,
                      ...(cardMotion === "idle" && cardDrag !== 0
                        ? {
                            transform: `translateX(${cardDrag}px) rotate(${cardDrag / 90}deg)`,
                            opacity: Math.max(.82, 1 - Math.abs(cardDrag) / 700),
                          }
                        : {}),
                    } as React.CSSProperties
                  }
                  onPointerDown={(event) => {
                    if (!event.isPrimary || motionLocked.current) return;
                    swipeStart.current = {
                      x: event.clientX,
                      y: event.clientY,
                      pointerId: event.pointerId,
                    };
                    swipeHandled.current = false;
                    setCardExitOrigin(0);
                    setCardDragging(true);
                    event.currentTarget.setPointerCapture(event.pointerId);
                  }}
                  onPointerMove={(event) => {
                    const start = swipeStart.current;
                    if (!start || start.pointerId !== event.pointerId) return;
                    const deltaX = event.clientX - start.x;
                    const deltaY = event.clientY - start.y;
                    if (Math.abs(deltaX) > 7 && Math.abs(deltaX) > Math.abs(deltaY)) {
                      setCardDrag(Math.max(-170, Math.min(170, deltaX)));
                    }
                  }}
                  onPointerUp={(event) => {
                    const start = swipeStart.current;
                    if (!start || start.pointerId !== event.pointerId) return;
                    const deltaX = event.clientX - start.x;
                    const deltaY = event.clientY - start.y;
                    swipeStart.current = null;
                    setCardDragging(false);
                    if (
                      Math.abs(deltaX) > 52 &&
                      Math.abs(deltaX) > Math.abs(deltaY) * 1.25
                    ) {
                      swipeHandled.current = true;
                      setCardExitOrigin(Math.max(-170, Math.min(170, deltaX)));
                      setCardDrag(0);
                      moveCard(deltaX < 0 ? 1 : -1);
                    } else {
                      setCardDrag(0);
                    }
                  }}
                  onPointerCancel={() => {
                    swipeStart.current = null;
                    setCardDragging(false);
                    setCardDrag(0);
                  }}
                  onAnimationEnd={(event) => {
                    if (event.target !== event.currentTarget) return;
                    if (motionPhase.current === "out") finishCardExit();
                    else if (motionPhase.current === "in") finishCardEnter();
                  }}
                  onClick={() => {
                    if (swipeHandled.current) {
                      swipeHandled.current = false;
                      return;
                    }
                    active.id === "alphabet"
                      ? speakAlphabetPart(current, "letter")
                      : speak(current);
                  }}
                >
                  <button className="play" aria-label="Хаза">
                    <AppIcon name="sound" />
                  </button>
                  {active.id !== "alphabet" && (
                    <button
                      className="word-favorite"
                      aria-label="Схьакъастина"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(`${active.id}:${current.id}`);
                      }}
                    >
                      <AppIcon
                        name={
                          favorites.includes(`${active.id}:${current.id}`)
                            ? "heart-filled"
                            : "heart"
                        }
                      />
                    </button>
                  )}
                  {active.id === "alphabet" ? (
                    <div className="alphabet-layout">
                      <div
                        className={`alphabet-letter-corner ${letterForms[0]?.length > 2 ? "long-letter" : letterForms[0]?.length > 1 ? "compound-letter" : ""}`}
                      >
                        <strong>{letterForms[0]}</strong>
                        <span>
                          {letterForms[1] || letterForms[0]?.toLowerCase()}
                        </span>
                      </div>
                      <button
                        className="alphabet-picture"
                        aria-label={`${tx(current.example || current.chechen)} хаза`}
                        onClick={(e) => {
                          e.stopPropagation();
                          speakAlphabetPart(current, "word");
                        }}
                      >
                        {current.image ? (
                          <img
                            src={current.image}
                            alt={tx(current.example || "")}
                            draggable={false}
                          />
                        ) : (
                          <span>{current.visual}</span>
                        )}
                      </button>
                    </div>
                  ) : current.image ? (
                    <div className="word-visual illustrated-visual">
                      <img src={current.image} alt="" draggable={false} />
                    </div>
                  ) : current.color ? (
                    <span
                      className="color-orb"
                      style={{ background: current.color }}
                    />
                  ) : (
                    <div
                      className={
                        active.id === "numbers"
                          ? "number-visual"
                          : "word-visual"
                      }
                    >
                      {current.visual}
                    </div>
                  )}
                  <h2>
                    {active.id === "alphabet" ? (
                      <AlphabetWord
                        word={tx(current.example || current.chechen)}
                        letter={letterForms[1] || letterForms[0]?.toLowerCase()}
                      />
                    ) : (
                      tx(current.example || current.chechen)
                    )}
                  </h2>
                  <p className="word-latin" lang="ce-Latn">
                    {latinize(current.example || current.chechen)}
                  </p>
                  {getWordTranslation(current.russian, settings.translation) && (
                    <p className="word-translation">
                      {getWordTranslation(current.russian, settings.translation)}
                    </p>
                  )}
                  <small>Дош хаза тӀетаӀайе</small>
                </div>
                <div className="pager">
                  <span>
                    {index + 1} / {active.words.length}
                  </span>
                </div>
              </div>
            </section>
          ) : (
            <section className="game-area">
              <div className="listen-task">
                <button
                  onClick={() => target && speak(target)}
                  aria-label="Дош хаза"
                >
                  <AppIcon name="sound" />
                </button>
              </div>
              <div className="answer-grid picture-only">
                {options.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => choose(w)}
                    className={
                      (selected?.id === w.id ? "chosen " : "") +
                      (answer === "right" && w.id === target?.id
                        ? "correct "
                        : "") +
                      (answer === "wrong" && selected?.id === w.id
                        ? "incorrect"
                        : "")
                    }
                  >
                    {w.image ? (
                      <img
                        className="answer-illustration"
                        src={w.image}
                        alt=""
                        draggable={false}
                      />
                    ) : w.color ? (
                      <i
                        className="answer-color"
                        style={{ background: w.color }}
                      />
                    ) : (
                      <b
                        className={
                          active.id === "numbers" ? "answer-number" : ""
                        }
                      >
                        {w.visual}
                      </b>
                    )}
                  </button>
                ))}
              </div>
              <div className={"feedback " + answer}>
                {answer === "right" ? (
                  <span className="icon-label">
                    Нийса! <AppIcon name="star" />
                  </span>
                ) : answer === "wrong" ? (
                  "Нийса дац. Юха хьажа!"
                ) : (
                  "Хаза, суьрта тӀетаӀайе"
                )}
              </div>
              {answer === "right" ? (
                <button
                  className="check-button next-button icon-label"
                  onClick={next}
                >
                  РогӀера <AppIcon name="arrow-right" />
                </button>
              ) : (
                <button
                  className="check-button"
                  disabled={!selected}
                  onClick={check}
                >
                  Таллам бе
                </button>
              )}
            </section>
          )}
          {paywall && (
            <div className="paywall" onClick={() => setPaywall(false)}>
              <div
                className="paywall-card"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="close-paywall"
                  onClick={() => setPaywall(false)}
                  aria-label="ДӀакъовла"
                >
                  <AppIcon name="close" />
                </button>
                <div className="paywall-icon">
                  <AppIcon name="unlock" />
                </div>
                <h2>Массо категореш дӀайоьлла</h2>
                <p>
                  ДӀаэцар дича, кху а, кхечу а категорешкахь долу массо дешнаш
                  дӀайоьллу.
                </p>
                <strong>2,99 €</strong>
                <span>Цкъа бен мах ца бо · массо приложенин таронаш</span>
                <button className="buy-button" onClick={unlock}>
                  Приложени дӀаэца
                </button>
              </div>
            </div>
          )}
        </main>
      </ScriptText>
    );
  }
  return (
    <ScriptText latin={false}>
      <main className="home-shell">
        <header>
          <a className="brand">
            KERLA <i>DOŞ</i>
          </a>
          <span className="header-actions">
            <button
              className="sound"
              onClick={() => setMuted(!muted)}
              aria-label={muted ? "Аз дӀайолаяйта" : "Аз дӀайаккха"}
            >
              <AppIcon name={muted ? "mute" : "sound"} />
            </button>
            <button
              className="sound settings-button"
              type="button"
              onClick={() => setSettingsOpen(true)}
              aria-label="ГӀирсаш"
            >
              <AppIcon name="settings" />
            </button>
          </span>
        </header>
        <section className="hero">
          <div>
            <p className="eyebrow">МАРША ДОГӀИЙЛА!</p>
            <h1>
              Нохчийн мотт
              <br /><span>ловзуш Ӏамо</span>
            </h1>
            <p>Хьажа а, ладогӀа а, Ӏамаде а, ловза а</p>
          </div>
        </section>
        <section className="home-progress" aria-label="Кхиам">
          <div className="progress-heading" aria-hidden="true">
            <span />
            <small>САН КХИАМ</small>
            <i />
          </div>
          <button
            className="continue-lesson"
            onClick={() => open(resumeCategory, resumeIndex)}
          >
            <span
              className="continue-art"
              style={{ "--resume-accent": resumeCategory.accent } as React.CSSProperties}
            >
              <img src={resumeCategory.icon} alt="" draggable={false} />
            </span>
            <span className="continue-copy">
              <small>{lastLesson ? "ӀАМОР ДӀАХӀОТТАДЕ" : "ӀАМОР ЙОЛАЙЕ"}</small>
              <strong>{tx(resumeCategory.title)}</strong>
              <em>
                {resumeIndex + 1} / {resumeCategory.words.length}
              </em>
              <i aria-hidden="true">
                <b
                  style={{
                    width: `${((resumeIndex + 1) / resumeCategory.words.length) * 100}%`,
                  }}
                />
              </i>
            </span>
            <span className="continue-arrow" aria-hidden="true">
              <AppIcon name="arrow-right" />
            </span>
          </button>
          <div className="home-stats">
            <span>
              <AppIcon name="book" />
              <b>{seenWords.length}</b>
              <small>Дешнаш</small>
            </span>
            <span>
              <AppIcon name="heart-filled" />
              <b>{favorites.length}</b>
              <small>Схьакъастина</small>
            </span>
            <span>
              <AppIcon name="star" />
              <b>{stars}</b>
              <small>Седарчий</small>
            </span>
          </div>
        </section>
        <section className="learning-paths">
          <button
            className="feature-card alphabet-feature"
            style={{ "--card": alphabetCategory.accent } as React.CSSProperties}
            onClick={() => open(alphabetCategory)}
          >
            <span className="feature-badge alphabet-badge">
              <img src={categoryIcons.alphabet} alt="" draggable={false} />
            </span>
            <span className="feature-copy">
              <strong>Абат Ӏамо</strong>
              <em>45 элп · хаза · масал</em>
            </span>
          </button>
          <button
            className="feature-card numbers-feature"
            style={{ "--card": categories[1].accent } as React.CSSProperties}
            onClick={() => open(categories[1])}
          >
            <span className="feature-badge numbers-badge">
              <img src={categoryIcons.numbers} alt="" draggable={false} />
            </span>
            <span className="feature-copy">
              <strong>Лоруш Ӏамо</strong>
              <em>0–30 · декъана</em>
            </span>
          </button>
          <button
            className="feature-card categories-feature"
            onClick={() => setHomeView("categories")}
          >
            <span className="category-preview" aria-hidden="true">
              <img src={categoryIcons.family} alt="" draggable={false} />
              <img src={categoryIcons.colors} alt="" draggable={false} />
              <img src={categoryIcons.animals} alt="" draggable={false} />
            </span>
            <span className="feature-copy">
              <strong>Дешнийн тобанаш</strong>
              <em>12 тоба · дешнаш а, ловзарш а</em>
            </span>
          </button>
        </section>
        <section className="content-directions">
          <div className="direction-grid">
            <button
              className="direction-card games-direction"
              onClick={() => setHomeView("games")}
            >
              <span><AppIcon name="puzzle" /></span>
              <strong>Ловзарш</strong>
              <small>Дош гулде · мозаика</small>
            </button>
            <button
              className="direction-card random-direction"
              onClick={() => setHomeView("random")}
            >
              <span>
                <img
                  src="/icons/sections/random.png"
                  alt=""
                  draggable={false}
                />
              </span>
              <strong>Тайп-тайпана дешнаш Ӏамо</strong>
              <small>Ца хаьржина дош гайта</small>
            </button>
            <button
              className="direction-card favorite-direction"
              onClick={() => setHomeView("favorites")}
            >
              <span>
                <img
                  src="/icons/sections/favorites.png"
                  alt=""
                  draggable={false}
                />
              </span>
              <strong>Схьакъастина</strong>
              <small>
                {favorites.length
                  ? `${favorites.length} дош юха Ӏамо`
                  : "Дешнаш лардийла"}
              </small>
            </button>
            <button
              className="direction-card stories-direction"
              onClick={() => setHomeView("stories")}
            >
              <span>
                <img
                  src="/icons/sections/stories.png"
                  alt=""
                  draggable={false}
                />
              </span>
              <strong>Туьйранаш</strong>
              <small>Хаза а, деша а</small>
            </button>
          </div>
        </section>
        <footer>
          <span>KERLA DOŞ</span>
          <p>Даймехкан мотт — берашна</p>
        </footer>
        {settingsOpen && (
          <SettingsPanel
            value={settings}
            onChange={saveSettings}
            stars={stars}
            premium={premium}
            onPreviewFree={() => {
              localStorage.removeItem("kerla-premium-v2");
              setPremium(false);
              setSettingsOpen(false);
            }}
            onClose={() => setSettingsOpen(false)}
            onReset={() => {
              if (confirm("Кхиам дӀабаккха?")) {
                setStars(0);
                localStorage.removeItem("kerla-stars");
              }
            }}
          />
        )}
      </main>
    </ScriptText>
  );
}
