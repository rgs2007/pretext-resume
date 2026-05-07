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

- The page should resemble a Kindle or e-ink reading screen.
- Keep the interface calm, readable, and tactile rather than flashy.
- Favor paper-like texture, restrained contrast, realistic device chrome, and
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
- The Kindle look uses a dark device bezel around a warm e-ink screen with subtle
  texture and reading chrome.
- The top bar contains the project label, `Aa` text zoom controls, and a battery
  indicator to mimic Kindle reading UI.
- The footer contains location, progress, and `pretext.js` measurement feedback.
- Text zoom changes the CSS reader font size and then asks `pretext.js` to
  remeasure line count and height, keeping the UI tied to actual text layout.
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
