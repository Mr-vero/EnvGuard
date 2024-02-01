const Table = require('cli-table3');

function displayTable(envVariables, parsedEnv) {
  const table = new Table({
    head: ['Variable Name', 'Found?'],
    colWidths: [30, 5],
  });

  envVariables.forEach(variable => {
    const found = parsedEnv.hasOwnProperty(variable);
    const lineInEnv = found
      ? `Line ${parsedEnv[variable].split('\n').findIndex(line => line.includes(parsedEnv[variable])) + 1}`
      : '';
    const checkmark = found ? '✅' : '❌';

    table.push([variable, checkmark]);
  });

  console.log(table.toString());
}

module.exports = {
  displayTable,
};
