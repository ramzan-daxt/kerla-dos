# Kerla Doş

A personal React project for learning Chechen vocabulary through illustrated cards, listening exercises and games. The interface is primarily in Chechen; vocabulary translations can be enabled in German, English or Russian.

Built with **React 19, Next.js 16 and TypeScript**. Next.js exports the application as static files. Progress stays in the browser; there is no account system or backend.

## Try it locally

Requires Node.js 22.13 or later and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. No API keys or environment variables are required. The repository includes illustrations and audio, so its initial download is fairly large.

Start with the alphabet or a free category. In settings (the gear button), select **Deutsch**, **English** or **Русский** to show translations on vocabulary cards. Sound may require a tap because of browser autoplay restrictions.

## Features

- Illustrated vocabulary cards with audio, swipe navigation and favorites
- Listening quizzes, word-building games and picture puzzles
- Resume the last lesson and keep progress between visits
- Random practice and review of saved words
- An illustrated reading section with page-turn interactions
- Settings for translation, audio, larger text and reduced motion

## Code map

| File | Responsibility |
| --- | --- |
| `app/page.tsx` | Main screen, category navigation and lesson interactions |
| `app/data/vocabulary.ts` | Shared categories, words and illustration mappings |
| `app/types.ts` | Word, category and lesson-position types |
| `app/hooks/use-learning-progress.ts` | React state and browser-storage synchronization |
| `app/lib/progress-storage.mjs` | Validation and storage of settings and progress |
| `app/lib/quiz-options.mjs` | Stable answer ordering for each quiz round |
| `app/home-extras.tsx` | Random practice and favorites |
| `app/game-center.tsx` | Word games and picture puzzles |
| `app/reading-library.tsx` | Reading library and story playback |
| `app/components/modal.tsx` | Dialog focus, Escape and focus restoration |
| `app/audio-pool.mjs` | Reusable audio elements for nearby cards |

A practical [code walkthrough in Russian](docs/code-tour.ru.md) follows one interaction through the application and includes small exercises.

## Checks and builds

```sh
npm run lint       # ESLint, including accessibility and React checks
npm run typecheck  # TypeScript
npm test           # Web regression tests using Node's test runner
npm run build      # Static production export in out/
npm run check      # All four checks
```

The web suite covers vocabulary conventions, translations, asset references, game logic, audio helpers and progress persistence. Some older tests check source text or asset presence; they are not a substitute for browser interaction tests. See [verification notes](docs/portfolio-verification.md) for the checked flows and remaining limitations.

## Scope and limitations

This is a learning project under active development, rather than a finished commercial language course.

- The “premium” controls are a **local demo**. They set a browser flag; no payment is taken and no access control is provided. Price text belongs to the prototype.
- Progress is specific to a browser and origin. It is not synchronized across devices and can be lost when browser data is cleared.
- Some recordings are missing or use demo audio. The browser speech fallback uses a Russian voice and must not be treated as reliable Chechen pronunciation.
- The reading library also contains religious stories. Vocabulary conventions, owner corrections, sources and illustration records are retained in `docs/`.
- Large image assets and several older components still need further optimization and refactoring. ESLint passes with warnings, including image optimization and some hook dependencies; these remain review work.
- The full dependency audit still reports development-tool advisories. The production dependency audit reports none at the time of verification; see the notes linked above.
- `ios/` contains an **unfinished Capacitor experiment**. Its Xcode project file is missing from the available source. `npm run test:ios` reports this separately; iOS is not part of the validated web build.

Publishing this repository does not grant a reuse license for its code, recordings, illustrations or source material. Asset provenance and content notes are preserved where available.

## Author

Ramzan Dakhtaev · [daxt.dev](https://daxt.dev)
