# Environment Variable Scanner and Auto-Fixer

This Node.js script scans a specified folder and its subdirectories for files containing `process.env` patterns. It identifies and extracts environment variables used in the code, displays them in a table, and provides an option to automatically fix missing environment variables by adding them to the `.env` or `.env.example` file depends on which file is available.

## Requirements

- Node.js installed (version 12 or higher)
- npm packages: `fs`, `path`, `dotenv`, `cli-table3`, `fast-csv`, `readline-sync`

## Usage

1. Clone the repository or download the script.
2. Run `npm install` to install the required packages.
3. Execute the script using `node app.js`.
4. Enter the folder/location path when prompted.

## Functionality

1. **Scanning Files:**
   - The script recursively finds all files in the specified folder and its subdirectories.
   - It reads each file, identifies `process.env` patterns, and logs the scanning process.

2. **Environment Variables Table:**
   - The script extracts unique environment variables and displays them in a table.
   - The table includes the variable name, whether it was found in the `.env` file, and the line in the `.env` file.

3. **Auto-Fix Missing Environment Variables:**
   - If prompted, the script allows the user to auto-fix missing environment variables.
   - It automatically appends the missing variables to the `.env` file.

4. **CSV Output:**
   - The script writes the scanned data to a CSV file (`env_variables_location.csv`), including variable name, file path, and line number.

5. **User Interaction:**
   - The user is prompted to auto-fix missing environment variables and can choose to check again.
   - The script displays the updated table after fixing the environment variables.

## Example

```bash
$ node app.js
Enter the folder/location path: /path/to/your/project

Scanning file: example.js in folder: /path/to/your/project
# ... (scanning output for each file)

Variable Name                Found?    Line in .env
-------------------------    -------   ------------
DATABASE_URL                 ✅        Line 1
API_KEY                      ❌
SECRET_KEY                   ✅        Line 3

Auto-Fix the env? (Y/N): Y
Missing environment variables added to .env file.

Variable Name                Found?    Line in .env
-------------------------    -------   ------------
DATABASE_URL                 ✅        Line 1
API_KEY                      ✅        Line 4
SECRET_KEY                   ✅        Line 3

Check again? (Y/N): N

CSV file created: env_variables.csv
```

## Notes

- Ensure you have appropriate permissions to read and write files in the specified folder.
- Review the added environment variables in the `.env` file to ensure correctness.
- Always backup your `.env` file before making changes.
- Right now, please use this tools in local machine only :)

Feel free to contribute and enhance the script as needed!
