import { displayInternWeekTable, getUnselectedInterns } from "./interns.js";
import { formatInternDetails, updateInternsTable } from "./interns.js";
import {
  savePairsToLocalStorage,
  loadPairsFromLocalStorage,
} from "./interns.js";

export function displayAddModal(button, pair, index) {
  button.onclick = function () {
    const modal = document.getElementById("edit-pair-modal");

    //display the modal
    modal.style.display = "block";

    //show interns to be added
    addIntern(pair, index);

    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName("edit-close")[0];

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

    document.getElementById("submit-modal").addEventListener("click", () => {
      modal.style.display = "none";
    });
  };
}

function addIntern(pair, index) {
  const modal = document.getElementById("edit-pair-modal");
  const modalHeader = document.getElementById("edit-modal-header");
  modalHeader.textContent = "Select Intern(s) to Add";

  const table = document.getElementById("intern-options");
  table.innerHTML = "";

  const internPool = getUnselectedInterns();

  if (internPool.length === 0) {
    modalHeader.textContent = "No Available Interns to Pair";
    return;
  }

  for (const intern of internPool) {
    table.appendChild(formatInternDetails(intern));
  }

  const pairs = loadPairsFromLocalStorage();

  document.getElementById("submit-modal").addEventListener("click", () => {
    const addedInterns = getSelectedInternsEdit();
    if (addedInterns.length < 1) {
      return;
    }
    pairs[index] = [...pair, ...addedInterns];
    savePairsToLocalStorage(pairs);
    displayInternWeekTable(pairs);
    updateInternsTable(addedInterns, true);
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

function getDeselectedInternsEdit() {
  //get interns selected to be added
  const deselectedInterns = [];
  const rows = document.querySelectorAll("#intern-options tr");

  rows.forEach((row) => {
    const selectButton = row.querySelector(".pill-select");
    if (selectButton) {
      const intern = {
        name: row.cells[1].textContent,
        location: row.cells[2].textContent,
        department: row.cells[3].textContent,
      };
      deselectedInterns.push(intern);
    }
  });

  return deselectedInterns;
}

export function displayRemoveModal(button, pair, index) {
  button.onclick = function () {
    // If we remove the group with no interns, we just delete the group.
    if (pair.length === 0) {
      const pairs = loadPairsFromLocalStorage();
      pairs.splice(index, 1);
      savePairsToLocalStorage(pairs);
      displayInternWeekTable(pairs);
      return;
    }

    const modal = document.getElementById("edit-pair-modal");

    //display the modal
    modal.style.display = "block";
    //show interns to be added
    removeIntern(pair, index);

    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName("edit-close")[0];

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

function removeIntern(pair, index) {
  const modal = document.getElementById("edit-pair-modal");
  const modalHeader = document.getElementById("edit-modal-header");
  modalHeader.textContent = "Deselect Intern(s) to Remove";

  const table = document.getElementById("intern-options");
  table.innerHTML = "";

  for (const intern of pair) {
    table.appendChild(formatInternDetails(intern));
  }

  const pairs = loadPairsFromLocalStorage();

  document.getElementById("submit-modal").addEventListener("click", () => {
    const removedInterns = getDeselectedInternsEdit();
    if (removedInterns.length < 1) {
      return;
    }

    //remove interns from pair by filtering out matched pairs
    const names = removedInterns.map((intern) => intern.name);
    pairs[index] = pair.filter((intern) => !names.includes(intern.name));

    savePairsToLocalStorage(pairs);
    displayInternWeekTable(pairs);
    updateInternsTable(removedInterns, false);
    modal.style.display = "none";
  });
}

const addPairButton = document.getElementById("add-pair-button");
addPairButton.addEventListener("click", function () {
  const pairs = loadPairsFromLocalStorage();
  savePairsToLocalStorage(pairs.unshift([]));
  displayInternWeekTable(pairs);
});
