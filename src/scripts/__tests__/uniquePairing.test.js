import shuffle from "../../util/shuffle.js";
import { uniquePairingHelper, isValidGroup } from "../../util/uniquePairing.js";
import pair from "../../util/pair.js";
import accuracy from "../../util/accuracy.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const associatesPath = join(__dirname, "../../documents/associates.json");
const associateInfo = JSON.parse(readFileSync(associatesPath, "utf-8"));

function pairAssociates(isUniqueDept, isUniqueLoc) {
  const associates = [];
  const fetchedAssociates = associateInfo;
  for (const [associate, associateInfo] of Object.entries(
    fetchedAssociates.associates,
  )) {
    associates.push({
      name: associate,
      ...associateInfo,
    });
  }

  shuffle(associates);
  uniquePairingHelper(associates, isUniqueDept, isUniqueLoc);
  return pair(associates);
}

function uniquePairingTest(test) {
  const pairs = pairAssociates(test.isUniqueDept, test.isUniqueLoc);

  const count = pairs.reduce(
    (accumulator, group) =>
      isValidGroup(group, test.isUniqueDept, test.isUniqueLoc)
        ? accumulator + 1
        : accumulator,
    0,
  );

  console.log(
    test.message,
    `\nPair Count: ${count} out of ${pairs.length} pairs `,
  );
  try {
    console.log("Acurracy: " + accuracy(count, pairs.length) + "\n");
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    console.log("0 Pairs were made because there was only 1 Associate\n");
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
