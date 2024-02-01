const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const Table = require('cli-table3');
const fastcsv = require('fast-csv');
const readline = require('readline-sync');

// Prompt user for the folder/location path
const folderPath = readline.question('Enter the folder/location path: ');

// Function to recursively find all files in a directory and its subdirectories
function getAllFiles(dir, fileArray = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory() && !filePath.includes('node_modules')) {
      getAllFiles(filePath, fileArray);
    } else if (fs.statSync(filePath).isFile() && !filePath.includes('node_modules')) {
      fileArray.push(filePath);
    }
  });
  return fileArray;
}

// Find all files in the specified folder and its subdirectories
const allFiles = getAllFiles(folderPath);

// Read all files and extract process.env patterns
const envVariablesSet = new Set();
const envVariablesArray = []
allFiles.forEach(filePath => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const regex = /process\.env\.([a-zA-Z_][a-zA-Z0-9_]*)/g;
    let match;
    while ((match = regex.exec(fileContent)) !== null) {

      //store to the array
      const variable = match[1].trim();
      const line = fileContent.substring(0, match.index).split('\n').length;
      envVariablesArray.push({ variable, filePath, line });

      //store to the set
      envVariablesSet.add(match[1].trim());
    }

    // Log the scanning process for each file
    console.log(`Scanning file: ${path.basename(filePath)} in folder: ${path.dirname(filePath)}`);
  } catch (error) {
    // Ignore errors reading files
  }
});

const envVariables = Array.from(envVariablesSet);

// Read the .env file or .env.example if present
let envFileContent = '';
if (fs.existsSync(path.join(folderPath, '.env'))) {
  envFileContent = fs.readFileSync(path.join(folderPath, '.env'), 'utf-8');
} else if (fs.existsSync(path.join(folderPath, '.env.example'))) {
  envFileContent = fs.readFileSync(path.join(folderPath, '.env.example'), 'utf-8');
}

// Parse the .env file content
const parsedEnv = dotenv.parse(envFileContent);

function displayTable() {
  // Create a table
  const table = new Table({
    head: ['Variable Name', 'Found?', 'Line in .env'],
    colWidths: [30, 10, 20],
  });

  // Iterate through each variable and add a row to the table
  envVariables.forEach(variable => {
    const found = parsedEnv.hasOwnProperty(variable);
    const lineInEnv = found ? `Line ${envFileContent.split('\n').findIndex(line => line.includes(parsedEnv[variable])) + 1}` : '';
    const checkmark = found ? '✅' : '❌';

    table.push([variable, checkmark, lineInEnv]);
  });

  // Output the formatted table to the console
  console.log(table.toString());
}

function fixMissingEnv(missingVariables, currentEnv) {
  // Read the existing .env file content
  let envFileContent = '';
  const envFilePath = path.join(folderPath, '.env');
  
  if (fs.existsSync(envFilePath)) {
    envFileContent = fs.readFileSync(envFilePath, 'utf-8');
  }

  // Filter out the missing variables that are already present in the current environment
  const uniqueMissingVariables = missingVariables.filter(variable => !currentEnv.hasOwnProperty(variable));

  // If there are any missing variables to add
  if (uniqueMissingVariables.length > 0) {
    // Create a new environment content with only the missing variables
    const newEnvContent = uniqueMissingVariables
      .map(variable => `# new (missing) added env: ${variable}\n${variable}=`)
      .join('\n\n');

    // Append the new content to the existing .env file content
    const finalEnvContent = `${envFileContent}\n${newEnvContent}`;

    // Overwrite the .env file with the updated content
    fs.writeFileSync(envFilePath, finalEnvContent);

    console.log('Missing environment variables added to .env file.');
  } else {
    console.log('No missing environment variables to add.');
  }
}



// Write the result to a CSV file
const csvFilePath = 'env_variables_location.csv';
fastcsv.writeToPath(csvFilePath, envVariablesArray, { headers: true })
  .on('finish', () => console.log(`CSV file created: ${csvFilePath}`));

// Display the initial table
displayTable();

// Prompt user to fix missing env variables
const fixEnv = readline.keyInYNStrict('Fix the env?');
if (fixEnv) {
  fixMissingEnv(envVariables, parsedEnv);

  // Display the table again after fixing the environment variables
  displayTable();
}

// Ask the user if they want to check again
const checkAgain = readline.keyInYNStrict('Check again?');
if (checkAgain) {
  // Display the table again after fixing the environment variables
  displayTable();
}
