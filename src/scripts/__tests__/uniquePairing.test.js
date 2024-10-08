import shuffle from "../../util/shuffle.js";
import { isValidPair, uniquePairingHelper } from "../filters.js";
import pair from "../../util/pair.js";
import accuracy from "../../util/accuracy.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const internsPath = join(__dirname, "../../documents/interns.json");
const internInfo = JSON.parse(readFileSync(internsPath, "utf-8"));

function pairInterns(isUniqueDept, isUniqueLoc) {
  const interns = [];
  const fetchedInterns = internInfo;
  for (const [intern, internInfo] of Object.entries(fetchedInterns.interns)) {
    interns.push({
      name: intern,
      ...internInfo,
    });
  }

  shuffle(interns);
  uniquePairingHelper(interns, isUniqueDept, isUniqueLoc);
  return pair(interns);
}

function uniquePairingTest(test) {
  let count = 0;
  const pairs = pairInterns(test.isUniqueDept, test.isUniqueLoc);

  count = pairs.reduce((accumultor, currentValue) => {
    // eslint-disable-next-line prettier/prettier
    return isValidPair(currentValue[0], currentValue[1], test.isUniqueDept, test.isUniqueLoc,)
      ? accumultor + 1
      : accumultor;
  }, 0);

  /*pairs.forEach((pair) => {
    if (pair.length === 2) {
      const [intern1, intern2] = pair;

      if (isValidPair(intern1, intern2, test.isUniqueDept, test.isUniqueLoc)) {
        count++;
      }
    }
  });*/

  console.log(test.testMessage, accuracy(count, pairs.length));
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
