const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

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

module.exports = {
  readEnvFile,
};