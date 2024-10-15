//accuracy: accuracy on matching the departments and locations
//pairing: pairing the groups of two and three
//shuffle: switching the pairing after each click on generate schedule
import shuffle from "../../util/shuffle.js";
import { isValidPair, uniquePairingHelper } from "../filters.js";
import pair from "../../util/pair.js";
import accuracy from "../../util/accuracy.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { filterByDepartment } from "../../util/filterByDepartment.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const internsPath = join(__dirname, "../../documents/interns.json");
const internInfo = JSON.parse(readFileSync(internsPath, "utf-8"));

function pairInterns(listofOurDepartments) {
  const interns = [];
  const fetchedInterns = internInfo;
  for (const [intern, internInfo] of Object.entries(fetchedInterns.interns)) {
    interns.push({
      name: intern,
      ...internInfo,
    });
  }

  shuffle(interns);
  interns = filterByDepartment(interns, listOfOurDepartments);
  return pair(interns);
}

function filterByLocationTest(test) {
  const pairs = pairInterns(test.department);
  let count = 0;
  for (const [intern1, intern2] of pairs) {
    if (
      test.department.length === 0 ||
      (test.department.includes(intern1.department) &&
        test.department.includes(intern2.department))
    ) {
      count++;
    }
  }

  console.log(
    test.message,
    `\nPair Count: ${count} out of ${pairs.length} pairs\nAcurracy: `,
    accuracy(count, pairs.length) + "\n",
  );
}

filterByLocationTest({
  department: ["Web Development"],
  message: "Test: Accuracy for Salinas filter:",
});
filterByLocationTest({
  department: ["Web Development", "Design"],
  message: "Test: Accuracy for Web Development and Design filter:",
});
filterByLocationTest({
  department: [
    "Web Development",
    "Design",
    "Video Production",
    "IT",
    "Marketing",
  ],
  message: "Test: accuracy for all departments filter:",
});
filterByLocationTest({
  department: ["Design"],
  message: "Test: Accuracy for Design filter:",
});
filterByLocationTest({
  department: ["Video Production"],
  message: "Test: Accuracy for Video Production filter:",
});
filterByLocationTest({
  department: ["IT"],
  message: "Test: Accuracy for IT filter:",
});
filterByLocationTest({
  department: ["Marketing"],
  message: "Test: Accuracy for Marketing filter:",
});
filterByLocationTest({
  department: [],
  message: "Test: Accuracy for empty list filter:",
});
