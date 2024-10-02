import displayQuestions from "./scripts/questions.js";
import displayFilters from "./scripts/filters.js";
import getInterns from "./scripts/getInterns.js";
import shuffle from "./util/shuffle.js";
import pair from "./util/pair.js";
import organizeInternInfo from "./scripts/organizeInternInfo.js";

function main() {
  const toggleIcon = document.getElementById("toggle-icon");
  const weekCardContent = document.getElementById("week-card-content");

  toggleIcon.addEventListener("click", () => {
    // Toggle the collapsed class to control max-height
    weekCardContent.classList.toggle("collapsed");

    // Toggle the chevron icon rotation
    toggleIcon.classList.toggle("rotate");
  });
  const generateButton = document.getElementById("schedule-button");

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
}

document.addEventListener("DOMContentLoaded", displayFilters());
document.addEventListener("DOMContentLoaded", main, { once: true });
