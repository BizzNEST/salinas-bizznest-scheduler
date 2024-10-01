import getQuestions from "./scripts/getQuestions.js";
import getInterns from "./scripts/getInterns.js";
import shuffle from "./util/shuffle.js";
import pair from "./util/pair.js";
import organizeInternInfo from "./scripts/organizeInternInfo.js";

document.addEventListener("DOMContentLoaded", () => {
  const toggleIcon = document.getElementById("toggle-icon");
  const weekCardContent = document.getElementById("week-card-content");

  toggleIcon.addEventListener("click", () => {
    // Toggle the collapsed class to control max-height
    weekCardContent.classList.toggle("collapsed");

    // Toggle the chevron icon rotation
    toggleIcon.classList.toggle("rotate");
  });

  async function displayQuestions(amountOfQuestions = 2) {
    let questions = await getQuestions(); // fetch questions
    shuffle(questions); // shuffle them
    questions = questions.slice(0, Math.max(0, amountOfQuestions)); // get the amountOfQuestions
    const ol = document.getElementById("ice-breaker-questions");
    ol.innerHTML = ""; // Clear any existing questions
    for (const question of questions) {
      const li = document.createElement("li");
      li.textContent = question;
      ol.appendChild(li);
    }
  }

  //displayQuestions();

  const generateButton = document.getElementById("schedule-button");

  //let internPairs = [];
  async function pairInterns() {
    const interns = await getInterns(); // fetch interns
    shuffle(interns); // shuffle them
    return pair(interns); //pair them
  }

  generateButton.addEventListener("click", function () {
    displayInternPairs();
    displayQuestions();
  });

  async function displayInternPairs() {
    const internPairs = await pairInterns();
    const table = document.getElementById("interns-table");
    table.innerHTML = ""; //clear out any previous pairings

    internPairs.forEach((pair, index) => {
      const row = document.createElement("tr"); //creating group row

      const groupNum = document.createElement("td"); //Group num column
      groupNum.textContent = "Group " + (index + 1);
      row.appendChild(groupNum);

      //add intern info columns
      for (const intern of pair) {
        row.appendChild(organizeInternInfo(intern));
      }

      //add to table
      table.appendChild(row);
    });
  }
});
