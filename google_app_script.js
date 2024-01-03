function renameColumnsBasedOnSynonyms() {
  // Set the URL of the synonyms definition
  var url = "https://raw.githubusercontent.com/MuckRock/foia-log-explorer-vacuumizer/main/synonyms.txt";
  
  // Fetch the synonyms text file content
  var response = UrlFetchApp.fetch(url);
  var text = response.getContentText();
  
  // Parse the text to create a mapping object
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

  // Get the currently active spreadsheet and sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var range = sheet.getDataRange();
  var values = range.getValues();

  // Assuming the first row contains headers
  var headers = values[0];

  // Check each header and replace it if it's a synonym
  headers.forEach(function(header, index) {
    if (mapping[header]) {
      // +1 because spreadsheet columns are 1-indexed
      sheet.getRange(1, index + 1).setValue(mapping[header]);
    }
  });
}
