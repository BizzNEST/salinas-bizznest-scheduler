import { stringToKebabCase } from "../util/stringToKebabCase.js";
import {
  internPairsSet,
  unselectedInternsSet,
} from "../constants/constants.js";
import { displayInternWeekTable, getUnselectedInterns } from "./interns.js";
import { formatInternDetails } from "./interns.js";

export function displayEditModal(button, pair, interns) {
  button.onclick = function () {
    var modal = document.getElementById("edit-pair-modal");

    //console.log(interns);
    modal.style.display = "block";
    displayInternModal(pair, interns);
    // Get the button that opens the modal
    var btn = document.getElementById("add");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("edit-close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
      modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  };
}

function displayInternModal(pair, interns) {
  const modal = document.getElementsByClassName("edit-modal-content");
  modal.innerHTML = "";

  const table = document.getElementById("intern-options");

  //console.log(unselectedInternsSet);

  for (const intern of getUnselectedInterns()) {
    table.appendChild(formatInternDetails(intern));
  }

  const index = interns.indexOf(pair);
  console.log("before:", interns);

  document.getElementById("submit-modal").addEventListener("click", () => {
    const addedIntern = getSelectedInternsEdit();

    console.log(addedIntern);
    console.log("pair:", pair);

    if (addedIntern.length > 0) {
      pair.push(...addedIntern);
      console.log("new Pair:", pair);
      interns[index] = pair;

      console.log("after:", interns);
      displayInternWeekTable();
    }
  });
}

function getSelectedInternsEdit() {
  const selectedInterns = [];
  const rows = document.querySelectorAll("#intern-options tr");
  console.log(rows);

  rows.forEach((row) => {
    const selectButton = row.querySelector(".pill-selected");
    if (selectButton) {
      const intern = {
        name: row.cells[1].textContent,
        location: row.cells[2].textContent,
        department: row.cells[3].textContent,
      };
      selectedInterns.push(intern);
      //internsSet.add(intern);
    }
  });

  return selectedInterns;
}
