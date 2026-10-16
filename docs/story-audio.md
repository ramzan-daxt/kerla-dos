# Story audio controls

Current audio is a 19-second Russian controls demo generated locally with macOS
Milena (`say -v Milena -r 145`), converted to PCM WAV with afconvert.
It is NOT a Chechen narration or an AI translation. The toolbar explicitly says
«Тест аудио». It is temporary, not intended as the published story soundtrack.

Add owner recordings to `public/audio/stories/<book>/<page>.m4a` (or WAV/MP3)
and map narrative page numbers in `app/story-audio.mjs` `storyRecordings`.
The demo badge disappears for mapped recordings. Covers/title/sources have no
recordings. Missing pages still use the labelled demo during this test phase.

- Toolbar play starts at page 1 from the cover/title; otherwise current page.
- Tap anywhere on the narrative illustration to pause/resume in place.
- Play/pause feedback lasts 450 ms, ignores pointers and respects reduced motion.
- Horizontal swipe is navigation, not an audio tap. Navigation pauses old audio
  before the page turn; committed manual navigation waits for another play tap.
- A cancelled turn resumes only if it was playing before the gesture.
- Natural end advances to the next narrative page and plays it. Final page ends
  without speaking sources. Playback rejection shows a retry message.
- Hidden document and reader exit pause/dispose playback. Pending promises are
  invalidated on pause/navigation/unmount; no speechSynthesis fallback is used.

Demo script: «Это тестовая озвучка для проверки плеера. Нажмите на иллюстрацию,
чтобы поставить звук на паузу. Нажмите ещё раз, чтобы продолжить с того же места.
При перелистывании звук предыдущей страницы остановится. Позже здесь будет
авторская запись рассказа на чеченском языке.»

Browser QA: play/pause taps and transient overlays, automatic next page, manual
swipe while playing. Controller unit tests cover resume position, replay, pending
promise cancellation, playback rejection and disposal. Real iPhone/iPad audio
policy still requires device testing; no on-device claim is made.
