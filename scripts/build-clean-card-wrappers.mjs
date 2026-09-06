import {readFileSync, writeFileSync} from 'node:fs';

// Lossless display wrappers: only isolated right-hand scan lines are excluded.
// Original PNG pixels, canvas dimensions and animal scale remain unchanged.
const cards = [
  ['animals/sheep', 651, 700, 649],
  ['animals/bear', 672, 700, 670],
  ['alphabet/cards/letter-29', 640, 380, 450],
  ['alphabet/cards/letter-35', 640, 380, 451],
];
for (const [name, width, height, cleanRight] of cards) {
  const original = readFileSync(`public/illustrations/${name}.png`).toString('base64');
  writeFileSync(`public/illustrations/${name}-clean.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs><clipPath id="clean"><rect width="${cleanRight}" height="${height}"/></clipPath></defs><image width="${width}" height="${height}" clip-path="url(#clean)" href="data:image/png;base64,${original}"/></svg>\n`);
}
