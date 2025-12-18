# BlightsEnd — Codebase audit and recommended improvements

This repository contains a small static site (compendium + character sheet) implemented as:

- `index.html`, `compendium.html`, `character.html` — page shells
- `style.css` — single stylesheet
- `script.js` — large single-file application logic (data + UI + routing)
- `sw.js` — simple service worker for offline caching
- `manifest.json` — PWA manifest

Summary of current state
- The app is functional and self-contained. The design and CSS are polished and consistent.
- Most runtime logic is implemented in `script.js` which contains both data (compendium arrays) and UI logic.
- There is duplication between pages (three HTML files all load `script.js` and have similar SW registration snippets). The service worker was registered with an absolute path which could fail when the app is served from a subpath — this has been updated to a relative registration.

Quick wins applied in this commit
- Use relative service worker registration in `index.html`, `compendium.html`, and `character.html` (`./sw.js`) to avoid registration errors when served from `/blightsend/` or other base paths.
- Added this README with an audit and next steps.

Prioritized recommendations
1) Split data from UI: move large data arrays (echoesData, weaponsData, etc.) into JSON files under a `data/` folder and fetch them. This makes content edits easy and reduces JS bundle size.
2) Modularize `script.js`: split into smaller modules — router, compendium renderer, sheet manager, utils. Use ES modules (type="module") or a tiny build (esbuild/rollup) if you prefer broader browser support.
3) Add a small build step (optional): local dev using `npm` + `esbuild` to transpile and bundle. Keep the deploy artifact as a single `dist/` folder for hosting.
4) Add tests: lightweight unit tests for data sanitization and basic DOM interactions (Jest + JSDOM or Playwright for E2E smoke tests).
5) Accessibility and performance: ensure interactive elements have accessible names/roles, add ARIA where useful, and audit Lighthouse for performance and accessibility.

Low-risk next steps you can take now
- Move compendium data into JSON files and update `script.js` to fetch them (works without a build). This reduces noise when editing rules/content.

Migration status (done)
- Compendium data has been migrated out of `script.js` into `data/` files. There are now:
	- `data/echoes.json`
	- `data/weapons.json`
	- `data/advancedSkills.json` (available as `skills.json` on disk)
	- `data/armor.json`
	- `data/conditions.json`

Loader behavior
- The app now only fetches JSON files from `./data/*.json`. JS fallback files were removed as part of cleanup — there is no runtime fallback to `data/*.js` anymore. If you need a supply fallback strategy, I recommend a small server-side redirect or making the app check for missing JSON and show a clear error to editors.

This approach keeps the app working without switching to ES modules and allows you to edit data files directly. If you'd like, I can:

- Convert any remaining JS fallback files into clean JSON (I can finish the sanitization manually).
- Switch the app to ES modules and import the JS data files directly (cleaner, but requires changing script tags to type="module").
- Break `script.js` into multiple files and turn on `type="module"` for modern browsers.
- Replace prompt-based load with a small modal or UI for saved characters.

If you'd like, I can implement one of the above next steps now (pick one):

- Extract compendium data into `data/echoes.json`, `data/weapons.json`, etc., and update the app to load them dynamically.
- Split `script.js` into `src/` modules and add a minimal build (esbuild) with `package.json` and npm scripts.
- Implement a nicer Save/Load character modal UI and tests for saving/loading.

Requirements coverage for this session
- Audit and suggestions: Done (this README)
- Low-risk fixes applied: Done (SW registration)

Contact / notes
If you want me to start extracting data or modularizing the code, tell me which option to prioritize and I'll update the todo list and begin.
