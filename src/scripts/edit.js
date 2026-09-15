import {
  displayAssociateWeekTable,
  getUnselectedAssociates,
} from "./associates.js";
import { formatAssociateDetails, updateAssociatesTable } from "./associates.js";
import {
  savePairsToLocalStorage,
  loadPairsFromLocalStorage,
} from "./associates.js";

export function displayAddModal(button, pair, index) {
  button.onclick = function () {
    const modal = document.getElementById("edit-pair-modal");

    //display the modal
    modal.style.display = "block";

    //show associates to be added
    addAssociate(pair, index);

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

function addAssociate(pair, index) {
  const modal = document.getElementById("edit-pair-modal");
  const modalHeader = document.getElementById("edit-modal-header");
  modalHeader.textContent = "Select Associate(s) to Add";

  const table = document.getElementById("associate-options");
  table.innerHTML = "";

  const associatePool = getUnselectedAssociates();

  if (associatePool.length === 0) {
    modalHeader.textContent = "No Available Associates to Pair";
    return;
  }

  for (const associate of associatePool) {
    table.appendChild(formatAssociateDetails(associate));
  }

  const pairs = loadPairsFromLocalStorage();

  document.getElementById("submit-modal").addEventListener("click", () => {
    const addedAssociates = getSelectedAssociatesEdit();
    if (addedAssociates.length < 1) {
      return;
    }
    pairs[index] = [...pair, ...addedAssociates];
    savePairsToLocalStorage(pairs);
    displayAssociateWeekTable(pairs);
    updateAssociatesTable(addedAssociates, true);
    modal.style.display = "none";
  });
}

function getSelectedAssociatesEdit() {
  //get associates selected to be added
  const selectedAssociates = [];
  const rows = document.querySelectorAll("#associate-options tr");

  rows.forEach((row) => {
    const selectButton = row.querySelector(".pill-selected");
    if (selectButton) {
      const associate = {
        name: row.cells[1].textContent,
        location: row.cells[2].textContent,
        department: row.cells[3].textContent,
        email: row.dataset.email,
      };
      selectedAssociates.push(associate);
    }
  });

  return selectedAssociates;
}

function getDeselectedAssociatesEdit() {
  //get associates selected to be added
  const deselectedAssociates = [];
  const rows = document.querySelectorAll("#associate-options tr");

  rows.forEach((row) => {
    const selectButton = row.querySelector(".pill-select");
    if (selectButton) {
      const associate = {
        name: row.cells[1].textContent,
        location: row.cells[2].textContent,
        department: row.cells[3].textContent,
        email: row.dataset.email,
      };
      deselectedAssociates.push(associate);
    }
  });

  return deselectedAssociates;
}

export function displayRemoveModal(button, pair, index) {
  button.onclick = function () {
    // If we remove the group with no associates, we just delete the group.
    if (pair.length === 0) {
      const pairs = loadPairsFromLocalStorage();
      pairs.splice(index, 1);
      savePairsToLocalStorage(pairs);
      displayAssociateWeekTable(pairs);
      return;
    }

    const modal = document.getElementById("edit-pair-modal");

    //display the modal
    modal.style.display = "block";
    //show associates to be added
    removeAssociate(pair, index);

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

function removeAssociate(pair, index) {
  const modal = document.getElementById("edit-pair-modal");
  const modalHeader = document.getElementById("edit-modal-header");
  modalHeader.textContent = "Deselect Associate(s) to Remove";

  const table = document.getElementById("associate-options");
  table.innerHTML = "";

  for (const associate of pair) {
    table.appendChild(formatAssociateDetails(associate));
  }

  const pairs = loadPairsFromLocalStorage();

  document.getElementById("submit-modal").addEventListener("click", () => {
    const removedAssociates = getDeselectedAssociatesEdit();
    if (removedAssociates.length < 1) {
      return;
    }

    //remove associates from pair by filtering out matched pairs
    const names = removedAssociates.map((associate) => associate.name);
    pairs[index] = pair.filter((associate) => !names.includes(associate.name));

    savePairsToLocalStorage(pairs);
    displayAssociateWeekTable(pairs);
    updateAssociatesTable(removedAssociates, false);
    modal.style.display = "none";
  });
}

// Prepend an empty group to the current week (used by the Edit menu).
export function addEmptyPair() {
  const pairs = loadPairsFromLocalStorage();
  pairs.unshift([]);
  savePairsToLocalStorage(pairs);
  displayAssociateWeekTable();
}
