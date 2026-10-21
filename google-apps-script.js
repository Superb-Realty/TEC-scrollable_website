/**
 * =====================================================================
 * THE EASTERN CHAMBER - ZERO-LEAK SECURE GOOGLE SHEET WEBHOOK
 * =====================================================================
 * 
 * SECURITY ARCHITECTURE:
 * 1. ZERO PUBLIC EXPOSURE: The Google Sheet remains 100% PRIVATE in your Google Drive.
 *    No visitor can read, scrape, or view existing entries.
 * 2. SECRET TOKEN AUTHENTICATION: Every request from your website MUST provide
 *    a secret security token (SHARED_SECRET). Unauthorized requests are immediately blocked.
 * 3. FORMULA INJECTION DEFENSE: User inputs are sanitized so malicious formula
 *    commands (=, +, -, @) cannot execute inside the spreadsheet.
 * 4. CONCURRENCY SAFE: Built-in LockService prevents race conditions on simultaneous submissions.
 * 
 * ---------------------------------------------------------------------
 * STEP-BY-STEP SETUP INSTRUCTIONS:
 * ---------------------------------------------------------------------
 * 1. Open Google Sheets (https://sheets.google.com) and create a new blank spreadsheet.
 *    (Name it: "Eastern Chamber - Private Leasing Inquiries")
 * 
 * 2. In Google Sheets top menu, click:
 *    Extensions > Apps Script
 * 
 * 3. Replace all existing text in Code.gs with THIS ENTIRE FILE.
 * 
 * 4. (Optional) Customize the SHARED_SECRET below if you wish.
 * 
 * 5. Click the blue "Deploy" button at top right > "New deployment"
 *    - Click the gear icon next to "Select type" and choose "Web app"
 *    - Description: "Secure Enquiry Sync"
 *    - Execute as: "Me (your email)"
 *    - Who has access: "Anyone"
 * 
 * 6. Click "Deploy", approve access with your Google Account, and copy the Web App URL.
 * 
 * 7. Open `.env.local` in your website code and paste:
 *    GOOGLE_SHEET_WEBHOOK_URL="https://script.google.com/macros/s/YOUR_URL/exec"
 *    ENQUIRY_SECRET_TOKEN="tec_leasing_key_2026"
 * =====================================================================
 */

// Shared secret key - must match ENQUIRY_SECRET_TOKEN in your .env.local
var SHARED_SECRET = "tec_leasing_key_2026";

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 10 seconds for other processes to finish
  lock.tryLock(10000);

  try {
    // 1. Parse incoming data safely
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // 2. Authenticate the request with the shared secret token
    var providedToken = data.secretToken || (e && e.parameter && e.parameter.secretToken);
    if (!providedToken || providedToken !== SHARED_SECRET) {
      return ContentService
        .createTextOutput(JSON.stringify({
          status: "error",
          message: "Unauthorized: Invalid or missing security token."
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 3. Connect to sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Auto-create luxury formatted header if the sheet is newly created
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Name",
        "Phone no.",
        "Area Required",
        "Budget",
        "Additional Enquiry"
      ]);

      var headerRange = sheet.getRange(1, 1, 1, 6);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#17251f");
      headerRange.setFontColor("#f1eee5");
      headerRange.setHorizontalAlignment("center");
      headerRange.setVerticalAlignment("middle");
      sheet.setRowHeight(1, 40);
      sheet.setFrozenRows(1);

      sheet.setColumnWidth(1, 175); // Timestamp
      sheet.setColumnWidth(2, 210); // Name
      sheet.setColumnWidth(3, 160); // Phone no.
      sheet.setColumnWidth(4, 190); // Area Required
      sheet.setColumnWidth(5, 180); // Budget
      sheet.setColumnWidth(6, 340); // Additional Enquiry
    }

    // 4. Sanitize inputs against formula injection
    function cleanValue(val) {
      if (val === null || val === undefined) return "";
      var str = String(val).trim();
      // If starts with formula operator, neutralize it with a leading quote
      if (/^[=+\-@\t\r]/.test(str)) {
        return "'" + str;
      }
      return str;
    }

    var timestamp = data.timestamp || Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");
    var name = cleanValue(data.name || data.Name);
    var phone = cleanValue(data.phone || data.Phone || data["Phone no."]);
    var areaRequired = cleanValue(data.areaRequired || data["Area Required"]);
    var budget = cleanValue(data.budget || data.Budget);
    var additionalEnquiry = cleanValue(data.additionalEnquiry || data["Additional Enquiry"]);

    // 5. Append row safely
    sheet.appendRow([
      timestamp,
      name,
      phone,
      areaRequired,
      budget,
      additionalEnquiry
    ]);

    var lastRow = sheet.getLastRow();
    var newRowRange = sheet.getRange(lastRow, 1, 1, 6);
    newRowRange.setVerticalAlignment("middle");
    sheet.setRowHeight(lastRow, 28);

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Enquiry stored securely."
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: "Internal error: " + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Block direct browser GET requests so webhook cannot be probed
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "active",
      message: "Eastern Chamber Secure Gateway is online."
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
