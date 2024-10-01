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

  let internPairs = [];
  async function pairInterns() {
    let interns = await getInterns(); // fetch interns
    shuffle(interns); // shuffle them
    internPairs = pair(interns); //pair them
  }
  pairInterns();

  generateButton.addEventListener("click", function () {
    pairInterns();
    displayInternPairs();
    displayQuestions();
  });

  function displayInternPairs() {
    let count = 0;
    const table = document.getElementById("interns-table");
    table.innerHTML = ""; //clear out any previous pairings

    internPairs.forEach((pair) => {
      count++;
      const row = document.createElement("tr"); //creating group row

      const groupNum = document.createElement("td"); //Group num column
      groupNum.textContent = "Group " + count;
      row.appendChild(groupNum);

      //add intern info columns
      for (let i = 0; i < pair.length; i++) {
        console.log(pair[i]);
        const intern = organizeInternInfo(pair[i]);
        row.appendChild(intern);
      }

      //add to table
      table.appendChild(row);
    });
  }
});
