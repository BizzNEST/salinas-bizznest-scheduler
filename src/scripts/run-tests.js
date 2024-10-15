import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the __tests__ directory
const testsDirectory = path.join(__dirname, "__tests__");

// Read all files in the __tests__ directory
fs.readdir(testsDirectory, async (err, files) => {
  if (err) {
    return console.error("Unable to scan directory:", err);
  }

  // Filter for .js files and import each one
  for (const file of files.filter((file) => path.extname(file) === ".js")) {
    try {
      console.log(`Running test file: ${file}`);
      const filePath = path.join(testsDirectory, file);
      const fileUrl = pathToFileURL(filePath).href;
      await import(fileUrl);
      console.log("\n");
    } catch (error) {
      console.error(`Error running test file: ${file}`);
      console.error(error);
    }
  }
});
