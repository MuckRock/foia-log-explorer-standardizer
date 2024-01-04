async function fetchAndParseSynonyms(url, caseInsensitive) {
    const response = await fetch(url);
    const text = await response.text();
    const lines = text.split("\n");
    const mapping = {};
    lines.forEach(function(line) {
        const parts = line.split(":");
        if (parts.length === 2) {
            const canonicalName = caseInsensitive ? parts[0].trim().toLowerCase() : parts[0].trim();
            const synonyms = parts[1].split(",");
            synonyms.forEach(function(synonym) {
                const key = caseInsensitive ? synonym.trim().toLowerCase() : synonym.trim();
                mapping[key] = canonicalName; 
            });
            mapping[canonicalName] = canonicalName;
        }
    });
    return mapping;
}

function handleFile() {
    var fileInput = document.getElementById('upload');
    var file = fileInput.files[0];
    var reader = new FileReader();
    reader.onload = async (e) => {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, {type: 'array'});
        var firstSheetName = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[firstSheetName];
        var json = XLSX.utils.sheet_to_json(worksheet, {raw: false, header: 1});
        
        var columnMapping = await fetchAndParseSynonyms(
            "https://raw.githubusercontent.com/MuckRock/foia-log-explorer-standardizer/main/synonyms.txt",
            true
        );
        var statusMapping = await fetchAndParseSynonyms(
            "https://raw.githubusercontent.com/MuckRock/foia-log-explorer-standardizer/main/status_synonyms.txt",
            true
        );
        
        var standardizedData = standardizeSpreadsheet(json, columnMapping, statusMapping);
        updateTable(standardizedData.data);
        updateUnknownSynonyms(standardizedData.unknownSynonyms);
        prepareDownload(standardizedData.data);
    };
    reader.readAsArrayBuffer(file);
}

function standardizeSpreadsheet(data, columnMapping, statusMapping) {
    var headers = data[0];
    var unknownSynonyms = [];
    var statusColIndex = headers.findIndex(h => h.toLowerCase() === "status") + 1;
    headers.forEach((header, index) => {
        var lowerHeader = header.toLowerCase().trim();
        if (columnMapping[lowerHeader] && columnMapping[lowerHeader] !== lowerHeader) {
            data[0][index] = columnMapping[lowerHeader];
        } else if (!columnMapping.hasOwnProperty(lowerHeader) && header.trim() !== "") {
            unknownSynonyms.push([header, "Synonym"]);
        }
    });

    if (statusColIndex > 0) {
        data.forEach((row, rowIndex) => {
            if (rowIndex > 0) {
                var status = row[statusColIndex - 1].toLowerCase().trim();
                if (statusMapping[status] && statusMapping[status] !== status) {
                    row[statusColIndex - 1] = statusMapping[status];
                } else if (!statusMapping.hasOwnProperty(status) && status.trim() !== "") {
                    unknownSynonyms.push([row[statusColIndex - 1], "Status Synonym"]);
                }
            }
        });
    }

    return {
        data: data,
        unknownSynonyms: unknownSynonyms
    };
}

function updateTable(data) {
    var table = document.getElementById('spreadsheet');
    table.innerHTML = "";
    data.forEach(function(rowData) {
        var row = document.createElement('tr');
        rowData.forEach(function(cellData) {
            var cell = document.createElement('td');
            cell.appendChild(document.createTextNode(cellData));
            row.appendChild(cell);
        });
        table.appendChild(row);
    });
}

function updateUnknownSynonyms(unknownSynonyms) {
    var div = document.getElementById('unknownSynonyms');
    div.innerHTML = "<h3>Unknown Synonyms</h3>";
    unknownSynonyms.forEach(function(syn) {
        var p = document.createElement('p');
        p.appendChild(document.createTextNode(syn[0] + " (" + syn[1] + ")"));
        div.appendChild(p);
    });
}

function prepareDownload(data) {
    var downloadButton = document.getElementById('download');
    downloadButton.style.display = 'block';
    downloadButton.onclick = function() {
        var csvContent = "data:text/csv;charset=utf-8," + data.map(e => e.join(",")).join("\n");
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "standardized_data.csv");
        document.body.appendChild(link);
        link.click();
    };
}