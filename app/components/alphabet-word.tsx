export default function AlphabetWord({ word, letter }: { word: string; letter: string }) {
  const at = word.toLocaleLowerCase().indexOf(letter.toLocaleLowerCase());
  if (at <= 0) return <>{word}</>;
  return (
    <>
      {word.slice(0, at)}
      <mark className="letter-in-word">
        {word.slice(at, at + letter.length)}
      </mark>
      {word.slice(at + letter.length)}
    </>
  );
}
