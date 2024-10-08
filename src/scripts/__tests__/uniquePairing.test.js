import shuffle from "../../util/shuffle.js";
import { isValidPair, uniquePairingHelper } from "../filters.js";
import pair from "../../util/pair.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const internsPath = join(__dirname, "../../documents/interns.json");
const internInfo = JSON.parse(readFileSync(internsPath, "utf-8"));

async function pairInterns(isUniqueDept, isUniqueLoc) {
  let interns = [];
  const fetchedInterns = internInfo;
  for (const [intern, internInfo] of Object.entries(fetchedInterns)) {
    interns.push({
      name: intern,
      department: internInfo.department,
      location: internInfo.location,
    });
  }

  shuffle(interns);
  uniquePairingHelper(interns, isUniqueDept, isUniqueLoc);
  return pair(interns);
}

async function uniquePairingTest(test) {
  let count = 0;
  const pairs = await pairInterns(test.isUniqueDept, test.isUniqueLoc);

  pairs.forEach((pair) => {
    if (pair.length === 2) {
      const [intern1, intern2] = pair;

      if (isValidPair(intern1, intern2, test.isUniqueDept, test.isUniqueLoc)) {
        count++;
      }
    }
  });

  const num_pairs = pairs.length;
  const percent = (count / num_pairs) * 100 + "%";

  console.log(test.testMessage, percent);
}

uniquePairingTest({
  isUniqueDept: true,
  isUniqueLoc: false,
  testMessage: "Testing accuracy unique departments:",
});
uniquePairingTest({
  isUniqueDept: false,
  isUniqueLoc: true,
  testMessage: "Testing accuracy unique locations:",
});
uniquePairingTest({
  isUniqueDept: true,
  isUniqueLoc: true,
  testMessage: "Testing accuracy unique departments & locations:",
});
