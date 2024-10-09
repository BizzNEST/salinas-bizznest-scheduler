import { readdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testsDirectory = path.join(__dirname, "__tests__");
const files = readdirSync(testsDirectory);

for (const file of files.filter((file) => path.extname(file) === ".js")) {
  console.log(`Running test file: ${file}`);
  try {
    await import(path.join(testsDirectory, file));
  } catch (error) {
    console.error(`Error running test file: ${file}`);
    console.error(error);
  }
  console.log("\n");
}
