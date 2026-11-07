# UI porting rules (read before touching any page)

The first React build does NOT match `design/`. The owner's screenshots show these causes. Fix all of them, then compare each page side by side with its design file before saying it is done.

## What is wrong, and the fix

1. **Page CSS was not ported.** Each design file has its own `<style>` block (calendar grid `.cal/.cl`, station grid `.grid/.st`, tool cards `.cd/.th`, form fields `.fld`, import table, and so on). Only `shared.css` was copied. Copy EVERY `<style>` block from each design file into that page's CSS, unchanged. Symptoms: calendar days stacked in a list, labels sitting inline beside inputs, filters and legend text glued together ("MaleFemaleUnknown gender").
2. **SVG drawings were not ported.** `hands-on.html` has an SVG sprite (`<svg><defs>` with `mon`, `hl`, `hr`, `d`, `w`, `a`). `tool-drawings.js` holds all 17 instrument drawings. Put the sprite in the page (or in `index.html`) and render each station and tool card with the drawing exactly as in the design. Symptom: stations and tools show no pictures.
3. **Vite starter CSS is still active.** Delete the default `index.css` / `App.css` rules (`body{display:flex;place-items:center}`, `#root{text-align:center;max-width:1280px;padding:2rem}`). Symptom: everything centered and squeezed.
4. **Two headers.** The app shell draws a header and each page draws the design's `.top` header again. Render the branded top bar (`.top` with logo, nav, user chip, Log out) ONCE in the shell. Pages must not include it. The top bar style is in `shared.css` (blue gradient bar, white nav, active pill).
5. **No data, so pages are empty or say "undefined".** Seed real data before showing a page: courses from `docs/COURSES_2026.json`, `courseDays` for every date, a few sample tools with serials and types (from the sample list in `design/tools.html`) and sample candidates in development. Never render "Hi undefined" or empty selects; show a clear empty state with a button that fixes it.
6. **Calendar must look like the printed one, but interactive.** `calendar.html` now opens on a **Year view**: 12 month cards (4 per row on desktop), course days colored by department, a legend under each month listing its courses with dates, and a Month view toggle. Tapping a colored day opens the day timetable and team panel. Match it.
7. **Desktop layout.** At 1100px and wider: content max-width 1280px; hands-on shows 6 stations per row and has an **All 12** button (data-show layout); tools use wider cards; year calendar 4 months per row. Phone layout stays as designed. Test both widths.

## How to check each page
- Open `design/<page>.html` in a browser and the React page next to it, at 390px and 1280px wide, in light and dark mode.
- Colors, spacing, drawings, labels and every button must match. Do not "simplify".
- Only then commit. Send the owner screenshots of both for approval before moving on.

## Home page and navigation (added)
- Route `/` is the **Home page** (`design/home.html`): a banner with the logo and a welcome line, then six big cards (Calendar, Hands-on, Attendance, Tools, Candidates, and Approvals for heads or My account for members). Each card opens its page. Card summaries are live from the API (next course, today's hands-on, who is on site, tools in use, candidates added). Red or amber badges show tools needing repair, candidates to review and accounts waiting for approval.
- **Home has no top bar.** Every other route shows the branded top bar (`design/topbar.css`), rendered once in the shell. The logo and a "Home" link in it return to `/`. In Present mode on the hands-on page the top bar is hidden.
- The top bar nav order: Home, Calendar, Hands-on, Attendance, Tools, Candidates, Account. The current page is highlighted.
- Members never see the Approvals card or screen; a head-only API check backs this up.

## Owner's review of the second build (14 problems). Fix every one.
Bugs in the build (the design already shows the right behavior):
1. **Hands-on:** the stations must show the tower drawings and be split into **Upper 1-6**, **Lower 7-12** and **All 12**, typed (dry / wet / animal) by the course day's hands-on type.
2. **Tools cards** must show the tool NAME and its drawing on the card itself, not just a number. Opening a tool must show the full detail view from `design/tools.html` (large drawing, status, history, comments, actions).
3. **Login must redirect to Home** (`/`) after success, and to the page the user was trying to reach if they were sent to log in.
4. **Home cards** must be large, show their picture (the drawings in `design/home.html`), the live summary line and badges, and the whole card must be clickable with a hover and press effect. Home content uses the full 1280px container, not the narrow account width.
5. **Candidates import** must have all four tabs (Paste, CSV or Excel, PDF, Photo), the file picker and the **Analyze** button, then the review screen. Pasting alone is not enough.
6. **"Back to calendar day"** (and every link between pages) must use router links to the real routes. It currently lands on Account.
7. **Remove every preview-only control** ("Preview screen", "View as", "Signed in as", "Preview date", "Preview clock") from the real app. They exist only in `design/`.
8. **Screenshots:** the evidence you sent shows only Account and Approvals for every page. Log in through the UI, click each nav item, wait for that page's own heading, and fail the run if the highlighted nav item does not match. Do not report a page as matching without a correct screenshot.

New or changed designs (implement exactly):
9. **Attendance** (`design/attendance.html`, rebuilt): today's course and day are found automatically from today's date and the calendar; no course or day picker. "I'm here" checks the person in and shows **Waiting for assignment**. Heads assign each checked-in person to **Upper** (always dry) or **Lower** (dry, wet or animal from that day's programme), can tap two names to swap them, move a selected name to a team, **Randomize** (heads are spread across both teams) and **Clear assignments**. Members then see which team they are in. Each team shows six big tower cards using the same drawings as the hands-on page (`station-sprite.js`).
10. **Add tool** (`design/tools.html`): heads can register a tool: preset category, preset type (or a new type with the closest drawing), suggested serial, registration date, optional photo. Serial must be unique. After saving, open the new tool.
11. **Course programme** (`design/calendar.html`): after tapping a course day, heads see a Course programme box: upload the programme as an image or PDF, press **Analyze**, check each day (hands-on type and timetable rows, editable), then Save. PDFs with selectable text are read exactly; images use OCR; always show the result for checking.
12. **Team activity** (`design/activity.html`, new, heads only): everything the team did (check-ins, assignments and swaps, tool changes and repair reports, candidate imports, account requests and approvals, programme changes), newest first, grouped by day, with filters. A **Team activity** card on Home and an **Activity** link in the top bar, both for heads only. The server must refuse non-heads.
13. **Logo crop:** use the updated CSS in `shared.css` and `topbar.css` (transform-origin) so only the blue lighthouse frame shows.
