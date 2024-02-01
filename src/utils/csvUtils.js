const fastcsv = require('fast-csv');

function writeToCSV(filePath, data) {
  fastcsv.writeToPath(filePath, data, { headers: true })
  .on('finish', () => console.log(`CSV file created: ${filePath}`));
}

module.exports = {
  writeToCSV,
};
