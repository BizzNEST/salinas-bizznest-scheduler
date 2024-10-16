//accuracy: accuracy on matching the departments and locations
//pairing: pairing the groups of two and three
//shuffle: switching the pairing after each click on generate schedule
import accuracy from "../../util/accuracy.js";
import pair from "../../util/pair.js";
import shuffle from "../../util/shuffle.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { filterByLocation } from "../../util/filterByLocation.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const internsPath = join(__dirname, "../../documents/interns.json");
const internInfo = JSON.parse(readFileSync(internsPath, "utf-8"));

function pairInterns(listOfOurLocations) {
  let interns = [];
  const fetchedInterns = internInfo;
  for (const [intern, internInfo] of Object.entries(fetchedInterns.interns)) {
    interns.push({
      name: intern,
      ...internInfo,
    });
  }

  shuffle(interns);
  interns = filterByLocation(interns, listOfOurLocations);
  return pair(interns);
}
function filterByLocationTest(test) {
  const pairs = pairInterns(test.locations);
  let count = 0;
  for (const [intern1, intern2] of pairs) {
    if (
      test.locations.length === 0 ||
      (test.locations.includes(intern1.location) &&
        test.locations.includes(intern2.location))
    ) {
      count++;
    }
  }

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

filterByLocationTest({
  locations: ["Salinas"],
  message: "Test: Accuracy for Salinas filter:",
});
filterByLocationTest({
  locations: ["Salinas", "Gilroy"],
  message: "Test: Accuracy for Salinas and Gilroy filter:",
});
filterByLocationTest({
  locations: ["Salinas", "Gilroy", "Watsonville", "Modesto", "Stockton"],
  message: "Test: accuracy for all locations filter:",
});
filterByLocationTest({
  locations: ["Watsonville"],
  message: "Test: Accuracy for Watsonville filter:",
});
filterByLocationTest({
  locations: ["Modesto"],
  message: "Test: Accuracy for Modesto filter:",
});
filterByLocationTest({
  locations: ["Stockton"],
  message: "Test: Accuracy for Stockton filter:",
});
filterByLocationTest({
  locations: [],
  message: "Test: Accuracy for empty list filter:",
});
