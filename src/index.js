const envUtils = require('./utils/envUtils');
const scanCommand = require('./commands/scan');
const fixCommand = require('./commands/fix');

// Prompt user for the folder/location path
const folderPath = scanCommand.promptFolderPath();

// Scan files and display table
const { envVariablesArray, envVariablesSet } = scanCommand.execute(folderPath);
const envVariables = Array.from(envVariablesSet);
const parsedEnv = envUtils.readEnvFile(folderPath);

scanCommand.displayTable(envVariables, parsedEnv);

// Prompt user to fix missing env variables
const fixEnv = scanCommand.promptFixEnv();
if (fixEnv) {
  fixCommand.execute(folderPath, envVariables, parsedEnv);

  // Display the table again after fixing the environment variables
  scanCommand.displayTable(envVariables, parsedEnv);
}

// Ask the user if they want to check again
const checkAgain = scanCommand.promptCheckAgain();
if (checkAgain) {
  // Display the table again after fixing the environment variables
  scanCommand.displayTable(envVariables, parsedEnv);
}
