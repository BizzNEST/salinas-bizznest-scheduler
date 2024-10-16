import shuffle from "../../util/shuffle.js";
import { isValidPair, uniquePairingHelper } from "../../util/uniquePairing.js";
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
  const pairs = pairInterns(test.isUniqueDept, test.isUniqueLoc);

  const count = pairs.reduce(
    (accumultor, [intern1, intern2]) =>
      isValidPair(intern1, intern2, test.isUniqueDept, test.isUniqueLoc)
        ? accumultor + 1
        : accumultor,
    0,
  );

  console.log(
    test.message,
    `\nPair Count: ${count} out of ${pairs.length} pairs `,
  );
  try {
    console.log("Acurracy: " + accuracy(count, pairs.length) + "\n");
  } catch (error) {
    console.log("0 Pairs were made because there was only 1 Intern\n");
  }
}

uniquePairingTest({
  isUniqueDept: true,
  isUniqueLoc: false,
  message: "Test: Accuracy for unique departments filter:",
});
uniquePairingTest({
  isUniqueDept: false,
  isUniqueLoc: true,
  message: "Test: Accuracy for unique locations filter:",
});
uniquePairingTest({
  isUniqueDept: true,
  isUniqueLoc: true,
  message: "Test: Acuracy for unique departments & locationsfilter:",
});
