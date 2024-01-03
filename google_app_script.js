function renameColumnsAndStatus() {
  // Fetch and parse column synonyms
  var columnUrl = "https://raw.githubusercontent.com/MuckRock/foia-log-explorer-vacuumizer/main/synonyms.txt";
  var columnMapping = fetchAndParseSynonyms(columnUrl);
  
  // Fetch and parse status synonyms
  var statusUrl = "https://raw.githubusercontent.com/MuckRock/foia-log-explorer-vacuumizer/main/status_synonyms.txt";
  var statusMapping = fetchAndParseSynonyms(statusUrl);
  
  // Get the currently active spreadsheet and sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var range = sheet.getDataRange();
  var values = range.getValues();

  // Renaming column headers
  var headers = values[0];
  headers.forEach(function(header, index) {
    if (columnMapping[header]) {
      // +1 because spreadsheet columns are 1-indexed
      sheet.getRange(1, index + 1).setValue(columnMapping[header]);
    }
  });

  // Renaming status column values
  var statusColIndex = headers.indexOf("status") + 1; // +1 because columns are 1-indexed
  if (statusColIndex > 0) {
    // iterate over each row in the status column
    for (var i = 1; i < values.length; i++) { // start from 1 to skip header
      var status = values[i][statusColIndex - 1]; // -1 because arrays are 0-indexed
      var newStatus = statusMapping[status] || ""; // if status not found, set as empty
      sheet.getRange(i + 1, statusColIndex).setValue(newStatus);
    }
  }
}

// Function to fetch and parse synonyms from URL
function fetchAndParseSynonyms(url) {
  var response = UrlFetchApp.fetch(url);
  var text = response.getContentText();
  var lines = text.split("\n");
  var mapping = {};
  lines.forEach(function(line) {
    var parts = line.split(":");
    var canonicalName = parts[0].trim();
    var synonyms = parts[1].split(",");
    synonyms.forEach(function(synonym) {
      mapping[synonym.trim()] = canonicalName;
    });
  });
  return mapping;
}
