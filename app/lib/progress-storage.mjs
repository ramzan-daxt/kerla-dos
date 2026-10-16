// Browser storage is optional: blocked access or invalid data must not stop a lesson.
function read(storage, key) {
  try { return storage?.getItem(key) ?? null; }
  catch { return null; }
}

function parse(storage, key) {
  try { return JSON.parse(read(storage, key)); }
  catch { return null; }
}

function stringList(value) {
  return Array.isArray(value)
    ? [...new Set(value.filter(item => typeof item === 'string'))]
    : [];
}

export function readProgress(storage, defaults) {
  const settings = { ...defaults };
  const saved = parse(storage, 'kerla-settings');
  const choices = {
    script: ['cyrillic'], translation: ['off', 'ru', 'en', 'de'],
    difficulty: [2, 3, 4], mosaicPieces: [6, 9, 12, 15],
    mosaicMode: ['tray', 'swap'], dailyGoal: [5, 10, 15],
  };
  if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
    for (const key of Object.keys(defaults)) {
      const value = saved[key];
      if (choices[key]) {
        if (choices[key].includes(value)) settings[key] = value;
      } else if (typeof defaults[key] === 'boolean' && typeof value === 'boolean') {
        settings[key] = value;
      } else if (key === 'volume' && Number.isFinite(value) && value >= 0 && value <= 1) {
        settings.volume = value;
      } else if (key === 'rate' && Number.isFinite(value) && value >= 0.5 && value <= 1.2) {
        settings.rate = value;
      }
    }
  }
  // Preserve the existing one-time autoplay migration.
  if (!read(storage, 'kerla-autospeak-v2')) settings.autoSpeak = true;
  const stars = Number(read(storage, 'kerla-stars'));
  const lesson = parse(storage, 'kerla-last-lesson');
  return {
    stars: Number.isSafeInteger(stars) && stars >= 0 ? stars : 0,
    premium: read(storage, 'kerla-premium-v2') === 'yes',
    settings,
    favorites: stringList(parse(storage, 'kerla-favorites')),
    learnedWords: stringList(parse(storage, 'kerla-learned-words')),
    lastLesson: lesson && typeof lesson.categoryId === 'string'
      && Number.isSafeInteger(lesson.index) && lesson.index >= 0
      ? { categoryId: lesson.categoryId, index: lesson.index } : null,
  };
}

export function writeProgress(storage, progress) {
  try {
    storage?.setItem('kerla-stars', String(progress.stars));
    storage?.setItem('kerla-premium-v2', progress.premium ? 'yes' : 'no');
    storage?.setItem('kerla-settings', JSON.stringify(progress.settings));
    storage?.setItem('kerla-favorites', JSON.stringify(progress.favorites));
    storage?.setItem('kerla-learned-words', JSON.stringify(progress.learnedWords));
    storage?.setItem('kerla-last-lesson', JSON.stringify(progress.lastLesson));
    storage?.setItem('kerla-autospeak-v2', 'yes');
    return storage != null;
  } catch {
    // Quota limits and private-browser restrictions leave in-memory progress usable.
    return false;
  }
}

export function browserStorage() {
  try { return window.localStorage; }
  catch { return null; }
}
