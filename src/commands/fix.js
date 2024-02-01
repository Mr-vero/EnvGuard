const fileUtils = require('../utils/fileUtils');

function execute(folderPath, missingVariables, currentEnv) {
  fileUtils.fixMissingEnv(folderPath, missingVariables, currentEnv);
}

module.exports = {
  execute,
};
