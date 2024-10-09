import swap from "../../util/swap.js";
import pair from "../../util/pair.js";
import shuffle from "../../util/shuffle.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const internsPath = join(__dirname, "../../documents/interns.json");
const internInfo = JSON.parse(readFileSync(internsPath, "utf-8"));

function filterByLocation2(interns, listOfLocations) {
  const selected = new Set(listOfLocations);
  return selected.size === 0
    ? interns
    : interns.filter((intern) => selected.has(intern.location));
}

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
  interns = filterByLocation2(interns, listOfOurLocations);
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
  const accuracy = (count / pairs.length) * 100 + "%";

  console.log(test.message, accuracy);
}

filterByLocationTest({
  locations: ["Salinas"],
  message: "Testing accuracy for Salinas only:",
});
filterByLocationTest({
  locations: ["Salinas", "Gilroy"],
  message: "Testing accuracy for Salinas and Gilroy:",
});
filterByLocationTest({
  locations: ["Salinas", "Gilroy", "Watsonville", "Modesto", "Stockton"],
  message: "Testing accuracy for all locations:",
});
filterByLocationTest({
  locations: ["Watsonville"],
  message: "Testing accuracy for Watsonville only:",
});
filterByLocationTest({
  locations: ["Modesto"],
  message: "Testing accuracy for Modesto only:",
});
filterByLocationTest({
  locations: ["Stockton"],
  message: "Testing accuracy for Stockton only:",
});
filterByLocationTest({
  locations: [],
  message: "Testing accuracy for empty list:",
});
