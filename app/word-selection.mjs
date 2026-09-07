/** Remove one particular tile, not all letters following its answer position.
 * @param {string[]} chosen
 * @param {string | undefined} tileId
 */
export function removeAnswerTile(chosen, tileId) {
  const index = chosen.indexOf(tileId);
  if (index < 0) return chosen;
  return chosen.map((id, position) => position === index ? "" : id);
}

/** Fill the first empty answer slot without moving existing tiles.
 * @param {string[]} chosen
 * @param {string} tileId
 */
export function addAnswerTile(chosen, tileId) {
  if (!tileId || chosen.includes(tileId)) return chosen;
  const index = chosen.indexOf("");
  return index < 0 ? [...chosen, tileId] : chosen.map((id, position) => position === index ? tileId : id);
}
