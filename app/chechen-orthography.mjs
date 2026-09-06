/**
 * Project spelling requested by the content owner. Apply ONLY to Chechen text,
 * never to translations, asset URLs, storage keys or identifiers.
 */
export function normalizeChechen(text) {
  return text.replace(/[А-Яа-яЁёӀӏ]+/g, word => {
    const uppercase = word.length > 1 && word === word.toUpperCase();
    return word.replace(/[яюЯЮ]/g, letter => ({
      я: "йа", ю: "йу",
      Я: uppercase ? "ЙА" : "Йа",
      Ю: uppercase ? "ЙУ" : "Йу",
    })[letter]);
  });
}

/** Word-card presentation only; preserve the source, translations and letter pairs. */
export function cardWord(text) {
  return text.replace(/^([\s«“"']*)(\p{L})/u, (_, prefix, letter) => prefix + letter.toLowerCase());
}
