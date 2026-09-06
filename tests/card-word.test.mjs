import test from "node:test";
import assert from "node:assert/strict";
import { cardWord } from "../app/chechen-orthography.mjs";

test("word cards start with a lowercase letter in both scripts", () => {
  for (const [source, expected] of [["Ваша", "ваша"], ["Vaşa", "vaşa"], ["Йиша", "йиша"], ["Ӏа", "ӏа"], ["доьзал", "доьзал"], ["12", "12"], ["", ""], ["«Борз»", "«борз»"]]) {
    assert.equal(cardWord(source), expected);
    assert.equal(cardWord(cardWord(source)), expected);
  }
});

test("card words are entirely lowercase, including compound words and transcription", () => {
  assert.equal(cardWord("НАНА"), "нана");
  assert.equal(cardWord("Доьзал А, Адамаш А"), "доьзал а, адамаш а");
  assert.equal(cardWord("VaŞa"), "vaşa");
});
