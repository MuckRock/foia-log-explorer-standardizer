function renameColumnsAndStatusAndLogMissingCaseInsensitiveWithFirstWordCheck() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var logSheet = ensureLogSheetExists(ss);

  try {
    // Fetch and parse column synonyms with case insensitivity
    var columnMapping = fetchAndParseSynonyms(
      "https://raw.githubusercontent.com/MuckRock/foia-log-explorer-vacuumizer/main/synonyms.txt",
      true
    );

    // Fetch and parse status synonyms with case insensitivity
    var statusMapping = fetchAndParseSynonyms(
      "https://raw.githubusercontent.com/MuckRock/foia-log-explorer-vacuumizer/main/status_synonyms.txt",
      true
    );

    var values = sheet.getDataRange().getValues();
    var headers = values[0].map(function(h) { return h.toLowerCase(); });
    var statusColIndex = headers.indexOf("status") + 1;

    var dataToWrite = [];
    var logData = [];

    // Process each header for renaming
    headers.forEach(function(header, index) {
      var lowerHeader = header.toLowerCase().trim();
      if (columnMapping.hasOwnProperty(lowerHeader) && columnMapping[lowerHeader] !== lowerHeader) {
        dataToWrite.push({ row: 1, col: index + 1, value: columnMapping[lowerHeader] });
      } else if (!columnMapping.hasOwnProperty(lowerHeader) && header.trim() !== "") {
        logData.push([header, "Synonym"]);
      }
    });

    // Process each status for renaming
    if (statusColIndex > 0) {
      for (var i = 1; i < values.length; i++) {
        var status = values[i][statusColIndex - 1].toLowerCase().trim();
        if (statusMapping.hasOwnProperty(status) && statusMapping[status] !== status) {
          dataToWrite.push({ row: i + 1, col: statusColIndex, value: statusMapping[status] });
        }
        if (!statusMapping.hasOwnProperty(status) && status.trim() !== "") {
          logData.push([values[i][statusColIndex - 1], "Status Synonym"]);
        }
      }
    }

    // Write all changes in bulk to sheet
    dataToWrite.forEach(function(change) {
      sheet.getRange(change.row, change.col).setValue(change.value);
    });

    // Log missing words to the Cleaner Log
    logData.forEach(function(logRow) {
      logSheet.appendRow(logRow);
    });

  } catch (e) {
    Logger.log("Error: " + e.toString());
  }
}

// Function to fetch and parse synonyms from URL, with option for case insensitive
function fetchAndParseSynonyms(url, caseInsensitive) {
  var response = UrlFetchApp.fetch(url);
  var text = response.getContentText();
  var lines = text.split("\n");
  var mapping = {};
  lines.forEach(function(line) {
    var parts = line.split(":");
    var canonicalName = parts[0].trim().toLowerCase();
    var synonyms = parts[1].split(",");
    synonyms.forEach(function(synonym) {
      var key = caseInsensitive ? synonym.trim().toLowerCase() : synonym.trim();
      mapping[key] = canonicalName; // store the canonical name as it is
    });
    // Ensure the canonical name points to itself
    mapping[canonicalName] = canonicalName;
  });
  return mapping;
}

// Ensure the Cleaner Log exists and return it
function ensureLogSheetExists(ss) {
  var logSheet = ss.getSheetByName("Cleaner Log");
  if (!logSheet) {
    logSheet = ss.insertSheet("Cleaner Log", ss.getNumSheets());
    logSheet.appendRow(["Word", "Type"]); // Initialize headers if new sheet
  }
  return logSheet;
}
