# STATUS.md

## What Was Built

A static, local-first web app for authors: **Book Launch Timeline**. Users pick a book launch date and receive a backward checklist (ARC readers, KDP preorder, ad campaign, newsletter announcement, final pre-launch check) with dates computed backward from launch. Progress is saved to browser localStorage — no account, no server, no tracking.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Main page: date picker, checklist grid, footer |
| `style.css` | Warm, accessible, responsive styling |
| `js/date-utils.js` | Date math functions + checklist item definitions |
| `js/storage.js` | localStorage save/load/clear wrappers |
| `js/app.js` | UI logic: render checklist, toggle complete, persist state |
| `tests/date-utils.test.js` | 34 unit tests for all date math |
| `package.json` | npm test script |
| `LICENSE` | MIT License, Copyright (c) 2026 Asdale Dynamics, LLC |
| `README.md` | Usage, privacy, tests, credits |
| `STATUS.md` | This file |

## How to Run

**Open directly:**
```bash
open index.html
```

**Or serve locally:**
```bash
npx serve .
```
Then visit `http://localhost:3000`.

**Run tests:**
```bash
npm test
```

## Verification Results

- **npm test**: 34 tests, 0 failures — all pass
- Date math verified: month boundaries, year boundaries, leap years (Feb 29), immutable operations, checklist item offset correctness, chronological sorting
- App initializes with a default launch date (30 days from today) when no saved state exists
- localStorage persistence works: launch date and completion state saved/restored
- Clear-all-data button works correctly

## Known Gaps

- localStorage may not work in all browsers when opened via `file://` protocol (works in Chrome/Edge; some browsers restrict file:// localStorage). A local server is recommended.
- No unit tests for `storage.js` or `app.js` — localStorage is browser-only so these weren't tested in Node.
- No automated end-to-end or visual regression testing.
- Checklist item offsets are hardcoded (not user-configurable).
- No data export/import beyond localStorage clear.
- Offline usage works after first load, but no service worker / PWA caching.
- No `.github/workflows` CI config (intentionally excluded per project rules).

## Credits

Created by **Asdale Dynamics, LLC** (Indianapolis, IN) — Dylan Asdale, RN turned AI author. For more beginner-friendly AI education and practical tools, visit [dylanasdale.github.io](https://dylanasdale.github.io).
