# Visual changes

## Chechen spelling

Use the owner's spelling rule in all Chechen words, stories and UI text:
я → йа, яь → йаь, ю → йу, юь → йуь (preserve case).
Use normalizeChechen for new Chechen data ingestion and test new content.
Do not apply this to Russian/English/German translations, filenames, URLs,
recorded audio, IDs or saved progress keys. Existing alphabet labels Йа / Йу /
Йуь already use this spelling; do not add/remove alphabet entries implicitly.
This is the project's content convention, not a claim about official standards.

The user requires responsive visual QA for changes anywhere in this application.
Before declaring a visual change finished:

- Inspect the whole affected composition, not just the modified element.
- Check narrow phones (320 and 414 CSS px), portrait tablets (768×1024), and landscape tablets (1024×768 and 1180×820).
- Check all affected content variants, especially long text and different illustration proportions.
- Verify actual image bounds, text/decoration containment, overlap, legibility, scrolling, and orientation changes. Passing builds alone is not visual validation.
- Do not hide layout bugs by clipping meaningful text, cropping characters, shrinking reading text, or adding artificial fields around images.
- Disclose any responsive interaction tradeoff (for example text scrolling). Do not call a compromise fully approved.
- Preserve existing assets; do not regenerate illustrations to fix CSS layout.
- Keep changes local until publication is authorized.
