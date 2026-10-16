# Visual changes

Owner approval (2026-09-18): implement all additions in
docs/story-editorial-review-2026-09-18.md. Preserve prior paragraphs; append
approved consequences and lessons. All four books use the six editorial beats:
setup, intrigue, development, climax, resolution, child lesson. These are not
child-facing labels. Redesign interiors to match their covers, no washes or
repeated framing, natural quiet copy space proportional to the text. New assets
must pass the existing no-eyes/no-prophets/headscarves and responsive QA rules.

Owner confirmation (2026-09-18): helicopter = пиллиг кема. Бурам, мара,
йазолг and ишколан у are owner-confirmed vocabulary. This is not confirmation
of new class markers or recording availability. Preserve existing IDs.

Owner update (2026-09-10, latest): covers show only the prophet's name.
The full title and «Делера салам хуьлда цунна» belong on a separate first
interior title page. Keep narrative numbering independent of that title page.

Owner update (2026-09-10): cover names, subtitles and blessing lines share
one vertical hierarchy across books. Preserve editable HTML cover typography.
Salih interiors must not repeat a mountain frame: vary actual scenes and
reserve natural quiet space proportional to each page's text, without washes.

Owner update (2026-09-10): women and girls in Salih's story wear closed
headscarves completely covering hair (including forehead/temples) and neck,
with natural fabric folds over shoulders. Faces remain open without drawn eyes.

Owner update (2026-09-09, latest): also update Nuh and Hud illustrations with
sparse ordinary people and animals where supported by each page's narration.
This supersedes the earlier instruction to keep their artwork unchanged.
Never depict a prophet or a central preacher/leader who could be mistaken for
one. The no-drawn-eyes rule applies to every person and animal in these books.

Owner clarification (2026-09-09, later): Salih page 5 may show the dead
she-camel lying motionless, without blood, wounds, violence or drawn eyes.
This specific scene supersedes the older blanket ban on dead figures below;
it does not authorize depicting dead people or prophets. Stories must state
the cause and consequences of events clearly, not omit them for brevity.

Owner clarification (2026-09-09): in prophet-story illustrations, eyes must be
omitted on BOTH humans and animals. Do not depict pupils, eye dots, eyelids,
closed-eye lines, painted-over patches, bands, masks or hollow sockets. Preserve
natural facial/muzzle contours and continuous skin/fur watercolor texture.

Owner update (2026-09-09): prophet stories may now include animals and ordinary
people with no drawn eyes, starting with Salih. Never depict any prophet, even
from behind, as a silhouette, body part or symbolic figure. Avoid a central
preacher/leader who could be mistaken for the prophet beside narration. No
violence or dead/injured figures in these books for young children. This is an
owner-selected art convention, not certification of Sharia compliance. Keep
previous Hud/Nuh artwork unchanged until separately requested.

Reading subsection label: «Пайхмарашах лаьцна дийцарш», not «Сира».

Owner update (2026-09-08): ручка = йазолг; доска = ишколан у.
Йупка is temporarily excluded from the shared vocabulary (cards and games).
Preserve its assets/progress for a possible return. New school-word classes
are not yet owner-confirmed; do not infer them from the replaced labels.

Owner update (2026-09-08): дешархо and хьехархо each represent male and female
people, with both ву and йу badges. Keep the same word IDs and recordings.
Use paired student/teacher illustrations and masculine/feminine Russian and
German labels; English Teacher/Student remain gender-neutral.

Owner additions (2026-09-08): бурам · ду = паром (Ferry / die Fähre);
мара · ду = лодка (Boat / das Boot). These are owner-supplied entries,
not newly verified Matsiev evidence. Dedicated recordings/artwork are pending;
current cards use transport emoji, as do the other transport entries.

Child-facing play and learning screens should not show prose instructions such as
"tap the picture", "tap letters", or "drag a piece". Keep vocabulary, story text,
button labels, results, parent settings and accessible control names. Prefer the
existing visual, audio and supported haptic feedback over reading-dependent tips.

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

Owner correction (2026-09-09): spell the prophet's Chechen name «Салихь»
throughout the cover and story, retaining ь before existing case endings.

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
