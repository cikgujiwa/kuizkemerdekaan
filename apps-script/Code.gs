/**
 * Apps Script endpoint untuk baca data yuran dari Google Sheet private (cth akaun MOE).
 * Deploy sebagai Web App (Execute as: Me, Who has access: Anyone within <domain>).
 *
 * Query param:
 * - sheet: nama sheet/tab (default: BAYARAN YURAN)
 */
function doGet(e) {
  var SHEET_ID = 'GANTI_DENGAN_SHEET_ID_ANDA';
  var DEFAULT_SHEET = 'BAYARAN YURAN';

  try {
    var sheetName = (e && e.parameter && e.parameter.sheet) || DEFAULT_SHEET;
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      return jsonOutput({
        success: false,
        message: 'Sheet tidak dijumpai: ' + sheetName,
        rows: []
      });
    }

    var values = sheet.getDataRange().getDisplayValues();
    if (!values || values.length < 2) {
      return jsonOutput({ success: true, rows: [], sheet: sheetName });
    }

    var headers = values[0];
    var rows = values.slice(1).map(function (row) {
      var obj = {};
      headers.forEach(function (header, index) {
        obj[header] = row[index] || '';
      });
      return obj;
    });

    return jsonOutput({
      success: true,
      sheet: sheetName,
      rows: rows
    });
  } catch (err) {
    return jsonOutput({
      success: false,
      message: String(err),
      rows: []
    });
  }
}

function jsonOutput(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
