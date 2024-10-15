import { internsSet } from "../constants/constants.js";
import {
  displayInternWeekTable,
  getUnselectedInterns,
  displayInternTable,
} from "./interns.js";
import { formatInternDetails } from "./interns.js";

export function displayEditModal(button, pair, interns) {
  button.onclick = function () {
    var modal = document.getElementById("edit-pair-modal");

    //display the modal
    modal.style.display = "block";

    //show interns to be added
    displayInternModal(pair, interns);

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
  const modal = document.getElementById("edit-pair-modal");

  const table = document.getElementById("intern-options");
  table.innerHTML = "";

  for (const intern of getUnselectedInterns()) {
    table.appendChild(formatInternDetails(intern));
  }

  const index = interns.indexOf(pair);

  document.getElementById("submit-modal").addEventListener("click", () => {
    const addedInterns = getSelectedInternsEdit();

    if (addedInterns.length > 0) {
      //modify global selected interns
      const names = addedInterns.map((intern) => intern.name);
      internsSet.add(names);

      //add new interns to pair
      pair.push(...addedInterns);
      interns[index] = pair;

      //display new changes to week & intern card
      displayInternWeekTable();
      displayInternTable();

      modal.style.display = "none";
    }
  });
}

function getSelectedInternsEdit() {
  //get interns selected to be added
  const selectedInterns = [];
  const rows = document.querySelectorAll("#intern-options tr");

  rows.forEach((row) => {
    const selectButton = row.querySelector(".pill-selected");
    if (selectButton) {
      const intern = {
        name: row.cells[1].textContent,
        location: row.cells[2].textContent,
        department: row.cells[3].textContent,
      };
      selectedInterns.push(intern);
    }
  });

  return selectedInterns;
}
