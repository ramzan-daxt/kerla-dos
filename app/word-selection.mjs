/** Remove one particular tile, not all letters following its answer position.
 * @param {string[]} chosen
 * @param {string | undefined} tileId
 */
export function removeAnswerTile(chosen, tileId) {
  const index = chosen.indexOf(tileId);
  if (index < 0) return chosen;
  return [...chosen.slice(0, index), ...chosen.slice(index + 1)];
}
