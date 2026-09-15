import shuffle from "../../util/shuffle.js";
import pair from "../../util/pair.js";
import accuracy from "../../util/accuracy.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { filterByDepartment } from "../../util/filterByDepartment.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const associatesPath = join(__dirname, "../../documents/associates.json");
const associateInfo = JSON.parse(readFileSync(associatesPath, "utf-8"));

function pairAssociates(listOfOurDepartments) {
  let associates = [];
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
  associates = filterByDepartment(associates, listOfOurDepartments);
  return pair(associates);
}

function filterByDepartmentTest(test) {
  const pairs = pairAssociates(test.departments);
  let count = 0;
  for (const [associate1, associate2] of pairs) {
    if (
      test.departments.length === 0 ||
      (test.departments.includes(associate1.department) &&
        test.departments.includes(associate2.department))
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
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    console.log("0 Pairs were made because there was only 1 Associate\n");
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
    "Digital Marketing",
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
  departments: ["Digital Marketing"],
  message: "Test: Accuracy for Digital Marketing filter:",
});
filterByDepartmentTest({
  departments: [],
  message: "Test: Accuracy for empty list filter:",
});
