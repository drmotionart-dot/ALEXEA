# Data model (MongoDB)

Design goal: few reads per screen. Embed what is always read together.

## users
`{ _id, name, username, passwordHash, role: "head"|"member", status: "pending"|"active"|"rejected", createdAt }`
- Index: `username` (unique). Only `active` users can log in.

## courses
`{ _id, name, color, startDate, endDate }`

## courseDays (one document per course day)
```
{
  _id, courseId, date, index,                 // index = day number inside the course
  type: "d12"|"dw"|"da"|"shift"|"none",      // 12 dry | 6 dry+6 wet | 6 dry+6 animal | shift day | no hands-on
  rows: [{ start, end, title, kind }],        // kind: lec|brk|live|h|h1|h2
  candidates: [candidateId],                  // who attends this day
  plan: {                                     // hands-on plan
    morning:   [{ station: 1..12, kind: "dry"|"wet"|"animal", people: [candidateId, candidateId?] }],
    afternoon: [...same shape]                // only for shift days
  },
  team: { <userId>: "U"|"L"|"" },             // Upper 1-6, Lower 7-12, off
  toolAssignments: [{ toolType, userId }],    // e.g. Harmonic handpiece
  locked: false,                              // head can lock the plan
  version: 1                                  // bumped on every change (Present mode checks this)
}
```
- Index: `{ courseId, date }`.

## candidates
```
{
  _id, courseId, nameAr, nameEn, gender: "m"|"f"|"u",
  countryId, cityId, hospitalId, experienceYears,
  isEgyptian,                      // derived from countryId, never typed
  leavesAt,                        // optional date-time (early departure)
  history: [{ date, kind, partner }]   // for rotation (see placement spec)
}
```
- Raw submitted text is kept in `raw: { country, city, hospital, name }` until a head confirms the match.

## places (country, city, hospital in one collection)
```
{ _id, type: "country"|"city"|"hospital", canonicalEn, canonicalAr, parentId?, aliases: [string] }
```
- `parentId`: city → country, hospital → city. A city implies its country.
- Seed countries and cities from GeoNames (free). Hospitals start empty and grow from confirmed matches.

## names (gender lookup)
`{ _id, nameLatin, nameAr, gender }`  Seed with common Arabic and Egyptian names. Confirmed names are added.

## toolTypes
`{ _id, code: "GR", name, category, drawing }`

## tools (one document per physical unit)
```
{
  _id, serial (unique), typeId, status: "available"|"inuse"|"maintenance",
  registeredAt, lastMaintenanceAt, photoUrl?,
  location: { courseDayId?, station?, userId?, note? },
  history:  [{ date, kind, note }],           // maintenance history
  comments: [{ by, date, text, needsRepair, resolved }]
}
```
- Index: `serial`, `{ typeId, status }`.
- Repair notifications: a comment with `needsRepair: true` and `resolved: false`. The bell counts those.

## attendance
`{ _id, courseDayId, userId, state: "present"|"late"|"absent", checkedInAt? }`

## Retention
A scheduled job deletes `candidates` and the candidate parts of `courseDays` 30 days after the course ends. Export a backup (JSON) on demand for heads, since the free cluster has no automated backups.

## activity (new; heads read it)
`{ _id, at, userId, kind: "checkin"|"assign"|"tool"|"repair"|"cand"|"acct"|"cal", text, link, refId? }`
- Write one record per action from the server (never trust the client to log). Index `{ at: -1 }`.
- Add a TTL index on `at` so records expire after 90 days (keeps the free database small).

## toolTypes and categories (presets)
Categories are fixed presets: Access, Optics, Hand instruments, Energy, Staplers, Gynecology and urology. Heads can add a new type under a category; each type has a closest drawing key from `design/tool-drawings.js`.

## courseDays: programme
`programmeFile` (link to the uploaded image or PDF in Cloudinary, optional), plus the editable `rows` and hands-on `type` per day, entered or corrected by a head after Analyze.

## attendance: assignment
Add `group: "U"|"L"|null` to each attendance record. `null` with a check-in means "waiting for assignment".

## Tool code (replaces the old ALX-XX-0000 format for new tools)
`serial` (unique) = `<2 letters of the type name><n><DDMMYY of registration>`, for example `GR5071126`. `n` = number of existing units whose type has the same 2 letters, plus 1. Types store their 2 code letters (`codeLetters`). Legacy serials such as `ALX-GR-0012` remain valid.

## users: passwords
Add `mustChangePassword: boolean`. A head's reset sets a random temporary password (shown once) and `mustChangePassword: true`; the next login forces a new password. Members change their own password with the current one.
