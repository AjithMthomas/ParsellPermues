/**
 * Pura Perfumes - Google Sheet Order Logger (Google Apps Script)
 * 
 * Setup Instructions:
 * 1. Open Google Sheets (https://sheets.new) and name it "Pura Perfumes - Orders".
 * 2. In Google Sheets top menu, click: Extensions > Apps Script.
 * 3. Delete any boilerplate code, and paste this entire code.
 * 4. Click "Deploy" (top right button) > "New deployment".
 * 5. Click the gear icon next to "Select type" and choose "Web app".
 * 6. Set the following deployment configuration:
 *    - Description: "Pura Perfumes Order Logger"
 *    - Execute as: "Me" (your email)
 *    - Who has access: "Anyone" (crucial so your store can send orders)
 * 7. Click "Deploy". Authorize permissions if prompted by Google.
 * 8. Copy the generated "Web app URL" (starts with: https://script.google.com/macros/s/.../exec).
 * 9. Paste this URL into your .env.local file:
 *    GOOGLE_SHEET_WEBHOOK_URL="https://script.google.com/macros/s/.../exec"
 * 10. That's it! Every order will now be logged into your sheet automatically before WhatsApp opens.
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 10 seconds for other concurrent requests
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();

    // Auto-create header row if sheet is brand new
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Order ID",
        "Customer Name",
        "WhatsApp / Phone",
        "City & State",
        "Delivery Address",
        "Items Summary",
        "Total Amount",
        "Status",
        "Customer Notes"
      ]);
      
      // Style header row
      var headerRange = sheet.getRange(1, 1, 1, 10);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#22180f");
      headerRange.setFontColor("#f6efe6");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
      
      // Auto resize columns
      for (var i = 1; i <= 10; i++) {
        sheet.setColumnWidth(i, 160);
      }
      sheet.setColumnWidth(7, 300); // Items column wider
    }

    var data = JSON.parse(e.postData.contents);
    var nowFormatted = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");

    sheet.appendRow([
      nowFormatted,
      data.orderId || "",
      data.name || "",
      "'" + (data.phone || ""), // prepended quote prevents leading 0 or + from being stripped
      data.city || "",
      data.address || "",
      data.items || "",
      data.total || "",
      data.status || "New (WhatsApp)",
      data.note || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success", orderId: data.orderId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "active", message: "Pura Perfumes Order Logger is live." }))
    .setMimeType(ContentService.MimeType.JSON);
}
