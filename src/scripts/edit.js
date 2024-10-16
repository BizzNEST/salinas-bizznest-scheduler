import { internPairsSet, internsSet } from "../constants/constants.js";
import {
  displayInternWeekTable,
  getUnselectedInterns,
  displayInternTable,
} from "./interns.js";
import { formatInternDetails } from "./interns.js";
import { savePairsToLocalStorage } from "./interns.js";

export function displayAddModal(button, pair, interns) {
  button.onclick = function () {
    var modal = document.getElementById("edit-pair-modal");

    //display the modal
    modal.style.display = "block";

    //show interns to be added
    addIntern(pair, interns);

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

function addIntern(pair, interns) {
  const modal = document.getElementById("edit-pair-modal");

  const table = document.getElementById("intern-options");
  table.innerHTML = "";

  for (const intern of getUnselectedInterns()) {
    table.appendChild(formatInternDetails(intern));
  }

  const idx = interns.indexOf(pair);
  console.log(idx);

  document.getElementById("submit-modal").addEventListener("click", () => {
    const addedInterns = getSelectedInternsEdit();
    if (addedInterns.length < 1) {
      return;
    }
    interns[idx] = [...pair, ...addedInterns];

    console.log(interns);

    savePairsToLocalStorage(interns);
    displayInternWeekTable(interns);

    modal.style.display = "none";
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

export function displayRemoveModal(button, pair, interns) {
  button.onclick = function () {
    var modal = document.getElementById("edit-pair-modal");

    //display the modal
    modal.style.display = "block";

    //show interns to be added
    removeIntern(pair, interns);

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

function removeIntern(pair, interns) {
  const modal = document.getElementById("edit-pair-modal");

  const table = document.getElementById("intern-options");
  table.innerHTML = "";

  for (const intern of pair) {
    table.appendChild(formatInternDetails(intern));
  }
  const idx = interns.indexOf(pair);
  console.log(idx);

  document.getElementById("submit-modal").addEventListener("click", () => {
    const removedInterns = getSelectedInternsEdit();

    //console.log(addedInterns.length);

    if (removedInterns.length !== 0) {
      //modify global selected interns
      const names = removedInterns.map((intern) => intern.name);
      internsSet.delete(names);

      //add new interns to pair
      pair = pair.filter((intern) => names.includes(intern.name));
      interns[idx] = pair;

      console.log(pair);

      internPairsSet.clear();
      for (const pair of interns) {
        internPairsSet.add(pair);
      }

      //display new changes to week & intern card
      displayInternWeekTable();
      displayInternTable();
    }

    modal.style.display = "none";
  });
}
