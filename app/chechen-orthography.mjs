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
