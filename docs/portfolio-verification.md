# Web portfolio verification

Prepared on 2026-10-17 from the existing Kerla Doş working tree, preserving its Git history and content records.

## Automated checks

- Clean dependency installation completed with `npm ci`.
- Framework updated to Next.js 16.4.2 and React 19.3.1.
- `npm audit --omit=dev`: zero known reported vulnerabilities at verification time.
- Full `npm audit`: seven development-tool findings remain in the Next ESLint plugin glob chain and the experimental Capacitor/Xcode chain. Audit recommends incompatible downgrades; these were not forced.
- `npm run lint`: no errors; existing warnings remain, particularly image optimization and hook dependencies.
- `npm run typecheck`: strict TypeScript check.
- `npm test`: 97 web tests, including corrupt/blocked storage, settings migration and stable quiz choices.
- `npm run build`: Next.js static production export.

The iOS test is deliberately separate (`npm run test:ios`). It currently fails because `ios/App/App.xcodeproj/project.pbxproj` is absent from the available source. This is not a validated iOS release.

## Browser review

The production export is reviewed locally, not deployed as part of repository preparation. Checks include settings after reload, quiz feedback and progress, favorites, navigation, and dialog keyboard behavior. Layouts are inspected at widths 320, 414, 768, 1024 and 1180 CSS pixels. Narrow or landscape screens can require vertical scrolling; this does not establish full device coverage.

## Remaining work

- Large bundled illustration library, including older versions
- Incomplete audio coverage and demo recordings
- Local-only progress and demo premium access
- Legacy effects and large components requiring further refactoring
- No comprehensive automated browser, screen-reader or physical-device test suite
