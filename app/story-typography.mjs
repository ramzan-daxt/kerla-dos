// Keep narration separate from speech, including attribution within a paragraph.
// The original block remains untouched for audio playback.
export function storyTextParts(block) {
  if (block.speaker === "Кхочушверг") {
    return [{ kind: "author", text: block.text }];
  }
  const separator = /,\s+—\s+/u.exec(block.text);
  if (separator) {
    return [
      { kind: "speech", text: `«${block.text.slice(0, separator.index)}»` },
      { kind: "author", text: `, —\u00a0${block.text.slice(separator.index + separator[0].length)}` },
    ];
  }
  const period = block.text.endsWith(".");
  return [{ kind: "speech", text: `«${period ? block.text.slice(0, -1) : block.text}»${period ? "." : ""}` }];
}
