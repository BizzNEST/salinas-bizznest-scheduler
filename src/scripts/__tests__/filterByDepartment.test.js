import shuffle from "../../util/shuffle.js";
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

function pairInterns(listOfOurDepartments) {
  let interns = [];
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

function filterByDepartmentTest(test) {
  const pairs = pairInterns(test.departments);
  let count = 0;
  for (const [intern1, intern2] of pairs) {
    if (
      test.departments.length === 0 ||
      (test.departments.includes(intern1.department) &&
        test.departments.includes(intern2.department))
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

filterByDepartmentTest({
  departments: ["Web Development"],
  message: "Test: Accuracy for Salinas filter:",
});
filterByDepartmentTest({
  departments: ["Web Development", "Design"],
  message: "Test: Accuracy for Web Development and Design filter:",
});
filterByDepartmentTest({
  departments: [
    "Web Development",
    "Design",
    "Video Production",
    "IT",
    "Marketing",
  ],
  message: "Test: accuracy for all departments filter:",
});
filterByDepartmentTest({
  departments: ["Design"],
  message: "Test: Accuracy for Design filter:",
});
filterByDepartmentTest({
  departments: ["Video Production"],
  message: "Test: Accuracy for Video Production filter:",
});
filterByDepartmentTest({
  departments: ["IT"],
  message: "Test: Accuracy for IT filter:",
});
filterByDepartmentTest({
  departments: ["Marketing"],
  message: "Test: Accuracy for Marketing filter:",
});
filterByDepartmentTest({
  departments: [],
  message: "Test: Accuracy for empty list filter:",
});
