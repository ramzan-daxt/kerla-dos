# Visual changes

Owner clarification (2026-09-07): налха, class бу = сливочное масло (Butter / die Butter).
Даьтта refers to oils such as sunflower or olive oil, not this butter card.

Latest owner corrections (2026-09-07) take precedence over older spellings:
бадарж, куьртиг, йупка, догӀа (key, singular), ишкап, стогар, шаьлдар,
машен, цӀерпошт, кема (airplane), хӀордкема (ship), вилиспет, чатаз,
йоккха машен. Taxi and scooter are removed from the vocabulary pool.
Class approvals are in app/word-classes.ts ownerClasses; шича has ву/йу.
Do not present these explicit owner choices as newly verified Matsiev entries.

## Vocabulary sources

Verify new Chechen vocabulary against Matsiev and record the entry, meaning and
electronic PDF page in docs/maciev-vocabulary.md. Do not invent translations or
assume that Russian-looking loans are wrong. Preserve explicit owner exceptions:
уьстагӀ = овца (ка = баран), минот = минута (do not replace with минут).
Flag historical/modern discrepancies for review.
Preserve the owner's corrections listed in docs/maciev-vocabulary.md, including
ден да, ден нана, гӀабали, куртиг, йупка, ишкола, сизар, бугӀул, шун, минот.
When changing a word, check every shared occurrence and its recording; unchanged
card IDs do not prove that old audio still matches the new label.

## Chechen spelling

Use the owner's spelling rule in all Chechen words, stories and UI text:
я → йа, яь → йаь, ю → йу, юь → йуь (preserve case).
Use normalizeChechen for new Chechen data ingestion and test new content.
Do not apply this to Russian/English/German translations, filenames, URLs,
recorded audio, IDs or saved progress keys. Existing alphabet labels Йа / Йу /
Йуь already use this spelling; do not add/remove alphabet entries implicitly.
This is the project's content convention, not a claim about official standards.

Display Chechen vocabulary words and their Latin transcription entirely lowercase
on learning cards, including random and favorite cards (use cardWord).
Keep alphabet letter pairs, UI headings, stories and translations unchanged.
Display letter tiles and selected answer letters uppercase in Дош гулде.
Never lowercase German translations: preserve their grammatical noun capitals.
Include a German noun's nominative definite article (der/die/das), using die for
plural translations. Preserve articles on each alternative noun. Do not derive
German articles from Chechen classes or add them to numerals, colors or adverbs.

The user requires responsive visual QA for changes anywhere in this application.
Before declaring a visual change finished:

- Inspect the whole affected composition, not just the modified element.
- Check narrow phones (320 and 414 CSS px), portrait tablets (768×1024), and landscape tablets (1024×768 and 1180×820).
- Check all affected content variants, especially long text and different illustration proportions.
- Verify actual image bounds, text/decoration containment, overlap, legibility, scrolling, and orientation changes. Passing builds alone is not visual validation.
- Do not hide layout bugs by clipping meaningful text, cropping characters, shrinking reading text, or adding artificial fields around images.
- Disclose any responsive interaction tradeoff (for example text scrolling). Do not call a compromise fully approved.
- Preserve existing assets; do not regenerate illustrations to fix CSS layout.
- After verified fixes, commit and push them to GitHub by default, as authorized by the owner. Report push failures; never force-push. Follow a later explicit local-only request when given.
