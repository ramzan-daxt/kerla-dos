/** Stable per round, so unrelated renders cannot move an answer under the pointer. */
export function quizOptions(words, targetId, count, round) {
  const target = words.find(word => word.id === targetId);
  if (!target) return [];
  let seed = round + 1;
  for (const char of targetId) seed = (seed * 31 + char.charCodeAt(0)) >>> 0;
  function shuffle(list) {
    const result = [...list];
    for (let i = result.length - 1; i > 0; i--) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const j = Math.floor((seed / 4294967296) * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  const others = shuffle(words.filter(word => word.id !== targetId));
  return shuffle([target, ...others.slice(0, Math.max(0, count - 1))]);
}
