const path = require('path');
const readline = require('readline-sync');
const fileUtils = require('../utils/fileUtils');
const envUtils = require('../utils/envUtils');
const tableUtils = require('../utils/tableUtils');

function promptFolderPath() {
  return readline.question('Enter the folder/location path: ');
}

function execute(folderPath) {
  const { envVariablesArray, envVariablesSet } = fileUtils.scanFiles(folderPath);
  const parsedEnv = envUtils.readEnvFile(folderPath);  // Corrected line

  return { envVariablesArray, envVariablesSet, parsedEnv };
}

function displayTable(envVariables, parsedEnv) {
  tableUtils.displayTable(envVariables, parsedEnv);
}

function promptFixEnv() {
  return readline.keyInYNStrict('Fix the env?');
}

function promptCheckAgain() {
  return readline.keyInYNStrict('Check again?');
}

module.exports = {
  promptFolderPath,
  execute,
  displayTable,
  promptFixEnv,
  promptCheckAgain,
};
