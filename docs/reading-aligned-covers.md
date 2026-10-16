# Common cover hierarchy — 2026-09-10

All four covers now use clean raster artwork with editable HTML lettering.
Original conceptual covers remain intact. ImageGen built-in edits removed
lettering only; exact prompts and source/output paths are in
`cover-clean-art-manifest.json`.

Integrated assets: `public/stories/{adam,nuh,hud,salih}/cover-clean-v1.png`.
Shared title group top: 9%; shared rows: 18cqw, 13cqw, auto. Identical name
size and explicit two-line subtitle/blessing. Book-specific colors retained.
Hud's group shifts horizontally to avoid the palm, never vertically. No wash,
text shadow, clipped text, or baked lettering.

Salih: pages 2, 3, 4, 6 now have open compositions. This pass added
`public/stories/salih/page-{3,4,6}-relief-open-v2.png` with actual-copy layout.
Page 3 has a compact sky area; page 4 a sandy foreground; page 6 settling dust.
Main-agent visual checks of pages 3,4,6 passed at 320×568, 414×896,
768×1024, 1024×768 and 1180×820, overriding conservative asset-only concerns
for pages 3 and 6 after checking actual text placement.

Pages 1, 5, 7 remain unchanged: corrected candidates still have a donkey eye,
a camel eye-region mark, or palm leaves intersecting the final text line.
Do not report the whole book redesigned. `salih-open-corrections-manifest.json`
preserves exact prompts/paths. No further image retries were performed.

Local-only for now: previous publication approval blocker remains unresolved.
