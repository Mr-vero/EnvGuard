const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

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

function extractEnvVariables(fileContent, filePath) {
  const envVariablesSet = new Set();
  const envVariablesArray = [];

  const regex = /process\.env\.([a-zA-Z_][a-zA-Z0-9_]*)/g;
  let match;

  while ((match = regex.exec(fileContent)) !== null) {
    const variable = match[1].trim();
    const line = fileContent.substring(0, match.index).split('\n').length;

    envVariablesArray.push({ variable, filePath, line });
    envVariablesSet.add(variable);
  }

  return { envVariablesArray, envVariablesSet };
}

function scanFiles(folderPath) {
  const allFiles = getAllFiles(folderPath);
  const result = { envVariablesArray: [], envVariablesSet: new Set() };

  allFiles.forEach(filePath => {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { envVariablesArray, envVariablesSet } = extractEnvVariables(fileContent, filePath);

      result.envVariablesArray = result.envVariablesArray.concat(envVariablesArray);
      result.envVariablesSet = new Set([...result.envVariablesSet, ...envVariablesSet]);

      console.log(`Scanning file: ${path.basename(filePath)} in folder: ${path.dirname(filePath)}`);
    } catch (error) {
      // Ignore errors reading files
    }
  });

  return result;
}

function readEnvFile(folderPath) {
  const envFilePath = path.join(folderPath, '.env');
  let envFileContent = '';

  if (fs.existsSync(envFilePath)) {
    envFileContent = fs.readFileSync(envFilePath, 'utf-8');
  } else if (fs.existsSync(path.join(folderPath, '.env.example'))) {
    envFileContent = fs.readFileSync(path.join(folderPath, '.env.example'), 'utf-8');
  }

  return dotenv.parse(envFileContent);
}

function fixMissingEnv(folderPath, missingVariables, currentEnv) {
  const envFilePath = path.join(folderPath, '.env');
  let envFileContent = '';

  if (fs.existsSync(envFilePath)) {
    envFileContent = fs.readFileSync(envFilePath, 'utf-8');
  }

  const uniqueMissingVariables = missingVariables.filter(variable => !currentEnv.hasOwnProperty(variable));

  if (uniqueMissingVariables.length > 0) {
    const newEnvContent = uniqueMissingVariables
      .map(variable => `# new (missing) added env: ${variable}\n${variable}=`)
      .join('\n\n');

    const finalEnvContent = `${envFileContent}\n${newEnvContent}`;
    fs.writeFileSync(envFilePath, finalEnvContent);

    console.log('Missing environment variables added to .env file.');
  } else {
    console.log('No missing environment variables to add.');
  }
}

module.exports = {
  getAllFiles,
  extractEnvVariables,
  scanFiles,
  readEnvFile,
  fixMissingEnv,
};
