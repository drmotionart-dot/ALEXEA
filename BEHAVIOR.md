# Screen and button behavior

Every control below must work. The visual look comes from `design/`.

## Account screens
- **Create account:** name, username, password. Creates a `pending` user and shows "Waiting for a head to approve your account".
- **Log in:** only `active` users. Wrong password or a pending account shows a clear inline message.
- **Approvals (heads only):** list of pending accounts with Approve and Reject. A head can also reset a member's password.

## Calendar
- **Upload calendar image:** reads courses and dates, then opens a confirmation list. Heads fix any wrong date before saving. In v1 the image is read with OCR; the user always confirms.
- **Use sample:** loads demo data (development only).
- **Tap a course day:** opens the day timetable.
- **Head / Intern switch:** shown only in the design preview. In the real app the role comes from the login.

## Day timetable
- Shows the hourly rows. The hands-on block is coloured by day type (12 dry, dry+wet, dry+animal, shift).
- **Team for the hands-on (head):** each member's selector sets Upper, Lower or Off. Members see it read-only. Only present members are listed.
- **Tool assignment (head):** assign a tool type (for example the Harmonic handpiece) to a member.
- **Open hands-on page:** goes to the station page for that day.

## Candidates
- **Add candidates:** paste, CSV/Excel, PDF or photo. Always ends on the review screen.
- **Review screen:** edit any cell, confirm uncertain matches ("Same as Cairo?"), set unknown genders. **Confirm** saves.
- **Mark absent / late / early departure** per candidate.

## Hands-on page
- **Day type buttons** (12 dry, 6 dry + 6 wet, 6 dry + 6 animal, Shift day) change the station layout. Heads only.
- **Morning / Afternoon** appears on shift days and swaps the two groups.
- **Upper 1–6 / Lower 7–12** switches the six stations shown.
- **Swap (heads):** tap the swap icon on one name, then on another. The two exchange places. Tapping the same icon twice cancels.
- **Gender "?"** badge: tapping lets a head set the gender.
- **Lock plan:** after locking, only heads can unlock.
- **Present mode:** full-screen view for the data show. Larger names, swap buttons hidden, refresh check every 15 seconds.
- **Export PowerPoint:** creates a .pptx of the final stations in the browser.

## Tools page
- **Search box:** live filter by name or serial. A summary line shows how many match and how many are in use, available or in maintenance. In-use tools list first and show station and candidate names.
- **Open serial:** opens the exact tool; shows an inline error if the serial does not exist.
- **Scan with camera:** reads a QR code or barcode with the phone camera and opens the tool. If the camera or scanner is unavailable, show a clear message and keep the manual field.
- **Type and status filters:** narrow the grid.
- **Bell:** shows the number of unresolved repair reports. Tapping it filters to those tools.
- **Tool card / detail:** drawing or photo, name, serial, status, registered date and age, last maintenance, location, maintenance history, comments.
- **Add photo / Replace photo (head):** on a phone opens the camera. Compress to about 100 KB, upload, save the link. **Use drawing** removes the photo.
- **Status buttons (head):** Available, In use, Maintenance. Members get **Start using** and **Return to stock**.
- **Post comment:** anyone. With **Needs repair** ticked it flags the tool, raises the bell count and sends a Telegram message to the heads.
- **Clear repair flag (head):** marks reports resolved.
- **Tool-to-station scan:** scanning a tool then a station QR sets its location to that station.

## Attendance
- **I'm here:** a member marks themselves present with the time. Marking after the course start time is "late".
- **Head edits:** a head can mark anyone present, late or absent.

## General
- All lists work on phone and laptop. Loading, empty and error states are shown for every screen.
- Errors are inline next to the control, never an alert popup.
- Names, comments and places use `dir="auto"` so Arabic and English display correctly together.

## Updates (second review)
- **Login:** on success go to Home. If the user was sent to log in from a page, return there.
- **Attendance:** see `UI_PORTING_RULES.md` item 9. A check-in with no group is "waiting". Heads assign, swap and randomize. Only present or late people can be assigned.
- **Today's course:** every page that needs a course day (attendance, hands-on) uses today's date to find it. If none, show "No course today" with the next course.
- **Add tool:** heads only. Validate: category, type, serial format `ALX-XX-0000` and unique, date not in the future.
- **Course programme:** heads upload an image or PDF, Analyze, review per day, Save. Saving updates the timetable and each day's hands-on type.
- **Team activity:** heads only. Filters by kind and person; Show more.
- **Home:** cards are large and clickable. Heads see Calendar, Hands-on, Attendance, Tools, Candidates, Team activity and Approvals. Members see the first five and My account.

## Updates (third review)
- **Change password:** My account > current password, new (min 8), confirm; the new one must differ from the current one. Wrong current password shows an inline error.
- **Forgot password:** no email. The login screen says to ask a head; the head presses Reset password and gives the temporary password; the member must set a new one on login.
- **Install app:** button on Home and My account; hidden when the app is already installed (standalone mode).
- **Add tool > Generate code:** regenerates the code from the type, the registration date and the count of same-letter tools. Editing the code by hand stops auto-generation until Generate code is pressed.
