# Codex Project Instructions

## Project Context

This repository is a static GitHub Pages project for a Kindle-inspired resume page.
The primary page is `index.html`, shared reader helpers live in
`reader-layout.js`, and the site is published from the root of the `main` branch.

Public site:
https://rgs2007.github.io/pretext-resume/

Local preview:
Open `C:\github_\pretext-resume\index.html` in a browser.

Basic tests:
Open `C:\github_\pretext-resume\tests\reader-layout.test.html` in a browser.

## Engineering Standards

- Follow clean code best practices: readable names, small functions, clear control
  flow, and minimal hidden state.
- Keep changes focused. Avoid broad rewrites unless the user explicitly asks for a
  larger redesign.
- Prefer simple browser-native HTML, CSS, and JavaScript for this project.
- Use SOLID principles where they apply naturally, especially single
  responsibility and dependency boundaries. Do not force abstractions into a small
  static page when plain code is clearer.
- Keep behavior testable by separating pure calculation from DOM updates whenever
  practical.
- Avoid duplicated constants. If a value controls behavior in multiple places,
  give it a meaningful name.
- Preserve accessibility for interactive controls with labels, semantic elements,
  keyboard-friendly behavior, and sufficient contrast.

## Logging

- Add logging only when it helps debug user-visible behavior or integration
  problems.
- Prefer concise, structured `console.info`, `console.warn`, or `console.error`
  messages over noisy logs.
- Do not leave temporary debugging logs in the final code.
- Never log secrets, tokens, private profile data, or unnecessary personal data.

## Testing

- Add basic unit tests when JavaScript behavior grows beyond trivial DOM wiring.
- Keep testable logic in small pure functions, for example text measurement input
  preparation, zoom step calculation, progress calculation, or formatting helpers.
- Prefer lightweight tests that can run locally without a complex build pipeline.
- This project currently uses browser-based HTML tests instead of a package
  manager or command-line test runner.
- For visible UI changes, verify the local `index.html` in a browser after each
  change.
- When using `pretext.js`, verify that measured values update after text size,
  width, or content changes.

## Comments

- This project intentionally favors regular plain-text comments in the code, even
  in places where strict clean-code style might normally remove them.
- Add comments for every meaningful section of HTML, CSS, and JavaScript that
  explain what the section is doing and why it exists.
- Add comments for design decisions, layout tradeoffs, browser quirks, test hooks,
  and non-obvious interactions.
- Add comments above helper functions explaining their role in the Kindle reader
  experience.
- When changing code, update nearby comments in the same edit so they stay true.
- When adding a feature, include comments that explain the user-facing behavior
  and the implementation approach.
- Avoid misleading or stale comments. It is better to rewrite a comment than leave
  an old explanation attached to new behavior.

## Design Direction

- The page should feel like a Kindle-inspired e-ink reading experience where the
  whole browser viewport is the screen.
- Keep the interface calm, readable, and tactile rather than flashy.
- Favor paper-like texture, restrained contrast, full-viewport web layout, and
  strong reading rhythm.
- Interactive controls should feel like Kindle reading controls, especially text
  sizing controls such as `Aa`.
- Avoid marketing-page composition. The first screen should be the usable reading
  experience.

## Current Design Decisions

- The app stays static and no-build so it can be opened directly and served by
  GitHub Pages without a package manager or bundler.
- `reader-layout.js` uses a classic browser script instead of an ES module so
  both the app and local `file://` tests can load the same production helpers.
- The visual frame should not exist: avoid adding a card, border, shadow, rounded
  panel, or Kindle hardware bezel around the reader. Keep the e-ink texture and
  reading chrome as the main Kindle-inspired cues.
- The top bar contains the project label and `Aa` text zoom controls.
- The footer contains page status, location, progress, page controls, and
  `pretext.js` measurement feedback.
- Text zoom changes the CSS reader font size and then asks `pretext.js` to
  remeasure line count and height, keeping the UI tied to actual text layout.
- The Kindle reader demonstrates animated reflow by using `pretext.js`
  `prepareWithSegments` and `layoutWithLines` to render individual measured text
  lines, then animate old lines out and new measured lines in after a zoom
  change.
- Glitch-free pagination is driven by measured `pretext.js` lines. The app slices
  those lines into page arrays based on the visible reader height and line height,
  then redraws exact measured slices instead of using scroll position or
  character-count guesses.
- On desktop, the reader should use a measured two-page spread to leverage the
  full browser width. Measure text against the computed column width, treat each
  column as its own page, and advance pagination by a full visible spread.
- Zoom and page changes should use clean transitions with no visual animation,
  blur, tilt, stretch, or page-turn effects unless the user explicitly asks to add
  effects back. Mouse wheel zoom over the reader should use the same discrete
  zoom stops as the `Aa` buttons.
- The reader may include an intentional liquid screen click effect: measured lines
  are split into word spans, and clicks on the reading surface create a ripple plus
  distance-based word wobble and reflective shimmer. Keep transform wobble on the
  outer word span and reflection/filter animation on an inner text span so the two
  effects do not override each other. Keep this separate from zoom and pagination
  transitions, which should remain clean.
- The current reader copy is based on text extracted from the user's uploaded
  resume PDF. Keep the full resume represented in the paginated reader unless the
  user explicitly asks for a shorter demo.
- The resume text should stay structured with section headings, role headers,
  contact lines, and bullet-style entries. The renderer may add CSS classes to
  measured `pretext.js` lines to restore resume hierarchy after line measurement.
- Reader zoom calculations are kept in small pure functions in
  `reader-layout.js` and exposed through `window.ReaderLayout` so the no-build
  browser tests can exercise production logic.
- `pretext.js` is loaded from jsDelivr because this project currently has no
  package manager, bundler, or local dependency installation.

## Maintenance Rules

- Update this `AGENTS.md` file when important design or engineering decisions
  change.
- If a future change adds a build tool, package manager, or test runner, document
  the commands here.
- If a future change adds generated files or deployment artifacts, document what
  should and should not be edited by hand.
