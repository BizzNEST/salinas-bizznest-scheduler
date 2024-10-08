const fs = require("fs");
const path = require("path");

// Path to the __tests__ directory
const testsDirectory = path.join(__dirname, "__tests__");

// Read all files in the __tests__ directory
fs.readdir(testsDirectory, (err, files) => {
  if (err) {
    return console.error("Unable to scan directory:", err);
  }

  // Filter for .js files and require each one
  files
    .filter((file) => path.extname(file) === ".js")
    .forEach((file) => {
      console.log(`Running test file: ${file}`);
      require(path.join(testsDirectory, file));
    });
});
