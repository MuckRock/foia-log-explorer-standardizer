function renameColumnsAndStatusAndLogMissingCaseInsensitive() {
  // Fetch and parse column synonyms
  var columnUrl = "https://raw.githubusercontent.com/MuckRock/foia-log-explorer-vacuumizer/main/synonyms.txt";
  var columnMapping = fetchAndParseSynonyms(columnUrl, true); // true for case insensitive
  
  // Fetch and parse status synonyms
  var statusUrl = "https://raw.githubusercontent.com/MuckRock/foia-log-explorer-vacuumizer/main/status_synonyms.txt";
  var statusMapping = fetchAndParseSynonyms(statusUrl, true); // true for case insensitive
  
  // Get the currently active spreadsheet and sheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var range = sheet.getDataRange();
  var values = range.getValues();

  // Ensure Cleaner Log exists
  var logSheet = ss.getSheetByName("Cleaner Log") || ss.insertSheet("Cleaner Log", ss.getNumSheets());
  var logSheetRange = logSheet.getDataRange();
  var logValues = logSheetRange.getValues();
  if (logValues.length === 0) { // If new, initialize headers
    logSheet.appendRow(["Word", "Type"]);
  }
  
  // Renaming column headers and logging missing synonyms
  var headers = values[0];
  headers.forEach(function(header, index) {
    var lowerHeader = header.toLowerCase();
    if (columnMapping[lowerHeader]) {
      // +1 because spreadsheet columns are 1-indexed
      sheet.getRange(1, index + 1).setValue(columnMapping[lowerHeader]);
    } else if (header.trim() !== "") {
      logSheet.appendRow([header, "Synonym"]);
    }
  });

  // Renaming status column values and logging missing statuses
  var statusColIndex = headers.map(function(header) { return header.toLowerCase(); }).indexOf("status") + 1; // +1 because columns are 1-indexed
  if (statusColIndex > 0) {
    // iterate over each row in the status column
    for (var i = 1; i < values.length; i++) { // start from 1 to skip header
      var status = values[i][statusColIndex - 1].toLowerCase(); // -1 because arrays are 0-indexed
      var newStatus = statusMapping[status];
      if (newStatus) {
        sheet.getRange(i + 1, statusColIndex).setValue(newStatus);
      } else if (values[i][statusColIndex - 1].trim() !== "") {
        sheet.getRange(i + 1, statusColIndex).setValue(""); // set cell to empty if not found
        logSheet.appendRow([values[i][statusColIndex - 1], "Status Synonym"]);
      }
    }
  }
}

// Function to fetch and parse synonyms from URL, with option for case insensitive
function fetchAndParseSynonyms(url, caseInsensitive = false) {
  var response = UrlFetchApp.fetch(url);
  var text = response.getContentText();
  var lines = text.split("\n");
  var mapping = {};
  lines.forEach(function(line) {
    var parts = line.split(":");
    var canonicalName = parts[0].trim();
    var synonyms = parts[1].split(",");
    synonyms.forEach(function(synonym) {
      var key = caseInsensitive ? synonym.trim().toLowerCase() : synonym.trim();
      mapping[key] = canonicalName; // store the canonical name as it is
    });
  });
  return mapping;
}
