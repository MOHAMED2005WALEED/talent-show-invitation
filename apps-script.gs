/**
 * TALENT SHOW 2024/2025 — RSVP → Google Sheet logger
 * -----------------------------------------------------
 * SETUP (about 5 minutes):
 *
 * 1. Go to https://sheets.google.com and create a new blank spreadsheet.
 *    Rename Sheet1's tab to "RSVPs" (or update SHEET_NAME below to match).
 *    In row 1, add these headers across columns A–E:
 *      Name | Email | Phone | Attendance | Submitted At
 *
 * 2. In that spreadsheet, open Extensions → Apps Script.
 *    Delete any starter code and paste this whole file in.
 *
 * 3. Click Deploy → New deployment.
 *      - Type: "Web app"
 *      - Execute as: "Me"
 *      - Who has access: "Anyone"
 *    Click Deploy, authorize the permissions Google asks for, then copy
 *    the "Web app URL" it gives you (ends in /exec).
 *
 * 4. Paste that URL into script.js, in the RSVP_SHEET_URL constant near
 *    the top of the file:
 *      const RSVP_SHEET_URL = "https://script.google.com/macros/s/XXXX/exec";
 *
 * That's it — every RSVP submitted on the website will now also appear
 * as a new row in this Google Sheet, viewable by anyone you share the
 * sheet with (Share → Add people).
 *
 * Note: if you ever change the form fields, update both this script and
 * the payload built in script.js so the columns keep lining up.
 */

const SHEET_NAME = "RSVPs";

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.name || "",
      data.email || "",
      data.phone || "",
      data.attendance || "",
      data.submittedAt || new Date().toISOString()
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
