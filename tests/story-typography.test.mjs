import test from "node:test";
import assert from "node:assert/strict";
import { storyTextParts } from "../app/story-typography.mjs";

test("speech uses paired guillemets with sentence punctuation", () => {
  for (const [text, expected] of [["Реза бу.", "«Реза бу»."], ["Буй?", "«Буй?»"], ["Бу!", "«Бу!»"]]) {
    assert.deepEqual(storyTextParts({speaker:"Ка", text}), [{kind:"speech",text:expected}]);
  }
});
test("author attribution is outside speech, with a protected dash space", () => {
  assert.deepEqual(storyTextParts({speaker:"Ка", text:"Реза бу, — меллаша жоп делира кано."}), [
    {kind:"speech",text:"«Реза бу»"},
    {kind:"author",text:", —\u00a0меллаша жоп делира кано."},
  ]);
});
test("narration retains its original punctuation and internal quotations", () => {
  const block={speaker:"Кхочушверг",text:"Барзо «ас дуй буу» оллушехь."};
  assert.deepEqual(storyTextParts(block), [{kind:"author",text:block.text}]);
});
test("formatting never modifies source used for audio", () => {
  const block=Object.freeze({speaker:"Борз",text:"Хlинца-м йуьзина йара со, — аьлла борзо."});
  const original=block.text;
  storyTextParts(block);
  assert.equal(block.text,original);
});
