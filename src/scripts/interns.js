import {
  getInterns,
  generatePairs,
  exportPairs,
} from "../api/interns/service.js";
import shuffle from "../util/shuffle.js";
import pair from "../util/pair.js";
import generateMailToString from "../util/sendEmail.js";
import { filterByDepartment } from "../util/filterByDepartment.js";
import { filterByLocation } from "../util/filterByLocation.js";
import { uniquePairing } from "../util/uniquePairing.js";
import { stringToKebabCase } from "../util/stringToKebabCase.js";
import { renderDepartmentLists, getSelectedOptions } from "./filters.js";
import { currentSearchQuery } from "../app.js";
import { displayAddModal, displayRemoveModal } from "./edit.js";
import { internsSet, locationEmojiMap } from "../constants/constants.js";
import { dynamicHeader } from "../util/dynamicHeader.js";
import { displayExportButton } from "./exportCSV.js";

export function savePairsToLocalStorage(pairs) {
  localStorage.setItem("internPairs", JSON.stringify(pairs));
}

export function loadPairsFromLocalStorage() {
  const pairs = localStorage.getItem("internPairs");
  return pairs ? JSON.parse(pairs) : [];
}

async function pairInterns() {
  const interns = getSelectedInterns();
  shuffle(interns);
  uniquePairing(interns, getSelectedOptions()["Unique Pairing"]);
  const serverPairs = await generatePairs(
    interns,
    getSelectedOptions()["Unique Pairing"],
  );
  exportPairs(serverPairs.pairs);
  return pair(interns);
}

function formatInternWeekDetails(intern) {
  const col = document.createElement("td"); //Create column for intern
  const internInfo = document.createElement("div"); //Column info div
  internInfo.className = "intern-pill-name-location";

  const pill = document.createElement("div"); //Department pill div
  pill.className = `pill pill-${stringToKebabCase(intern.department)}`;
  pill.innerHTML = `<b>${intern.department}</b>`;
  internInfo.appendChild(pill);

  const location = document.createElement("p"); //Location
  location.textContent = `${locationEmojiMap[intern.location]} ${intern.location}`;
  internInfo.appendChild(location);

  const name = document.createElement("p"); //Name
  name.textContent = intern.name;
  internInfo.appendChild(name);
  col.appendChild(internInfo);

  return col;
}

export async function displayInternWeekTable(savedPairs) {
  const internPairs = savedPairs != null ? savedPairs : await pairInterns();
  savePairsToLocalStorage(internPairs);

  renderDepartmentLists("department-list-2");
  const weekCard = document.getElementById("week-card-content");
  weekCard.style.display = "block";
  const departmentHeader = document.getElementById("department-headers-week");
  departmentHeader.innerText = "Departments";
  const tableHeader = document.getElementById("interns-week-table-header");
  tableHeader.innerHTML = "";

  internPairs.length === 0
    ? (tableHeader.innerHTML = `<tr><th>Not enough Interns selected to pair.</th></tr>`)
    : (tableHeader.innerHTML = dynamicHeader(internPairs));

  const tableBody = document.getElementById("interns-week-table-body");
  tableBody.innerHTML = ""; //clear out any previous pairings

  internPairs.forEach((pair, index) => {
    const row = document.createElement("tr"); //creating group row

    const groupNum = document.createElement("td"); //Group num column
    groupNum.innerHTML = `
    <div class="group-number-container">
      <a class="intern-email" href=${generateMailToString(pair.map((intern) => intern?.email ?? ""))}>📧 Group ${index + 1}</a>
    </div>`;

    const addInternToPairButton = document.createElement("button"); //add edit button
    addInternToPairButton.className = "edit";
    addInternToPairButton.id = "add-intern";
    addInternToPairButton.type = "button";
    addInternToPairButton.innerHTML = `<i class="fa-solid fa-user-plus"></i>`;
    groupNum.appendChild(addInternToPairButton);

    displayAddModal(addInternToPairButton, pair, index); //display add functionality

    const removeInternFromPairButton = document.createElement("button"); //remove edit button
    removeInternFromPairButton.className = "edit";
    removeInternFromPairButton.id = "remove-intern";
    removeInternFromPairButton.type = "button";
    removeInternFromPairButton.innerHTML = `<i class="fa-solid fa-user-minus"></i>`;
    groupNum.appendChild(removeInternFromPairButton);
    row.appendChild(groupNum);

    displayRemoveModal(removeInternFromPairButton, pair, index);

    if (pair.length === 0) {
      removeInternFromPairButton.innerHTML = `<i class="fa-solid fa-minus"></i>`;
    }

    //add intern info columns
    for (const intern of pair) {
      row.appendChild(formatInternWeekDetails(intern));
    }

    //add to table
    tableBody.appendChild(row);
  });
  displayExportButton();
}

export function formatInternDetails(intern) {
  const row = document.createElement("tr"); // Create a row for the intern
  row.dataset.name = intern.name;
  row.dataset.email = intern.email;
  // Create column for the select button
  const selectCol = document.createElement("td");
  const selectButton = document.createElement("button");
  if (internsSet.has(intern.name)) {
    selectButton.className = "pill-selected";
    selectButton.textContent = "Deselect";
  } else {
    selectButton.className = "pill-select";
    selectButton.textContent = "Select";
  }
  selectButton.addEventListener("click", function () {
    if (selectButton.classList.contains("pill-select")) {
      selectButton.textContent = "Deselect";
      selectButton.classList.remove("pill-select");
      selectButton.classList.add("pill-selected");
      internsSet.add(intern.name);
    } else {
      selectButton.textContent = "Select";
      selectButton.classList.remove("pill-selected");
      selectButton.classList.add("pill-select");
      internsSet.delete(intern.name);
    }
  });
  selectCol.appendChild(selectButton);
  row.appendChild(selectCol);

  // Create column for the intern name
  const nameCol = document.createElement("td");
  const namePtag = document.createElement("p");
  namePtag.textContent = intern.name;
  namePtag.className = "intern-list-text";
  nameCol.appendChild(namePtag);
  row.appendChild(nameCol);

  const locationCol = document.createElement("td");
  const locationPtag = document.createElement("p");
  locationPtag.textContent = intern.location;
  locationPtag.className = "intern-list-text";
  locationCol.appendChild(locationPtag);
  row.appendChild(locationCol);

  // Create column for the intern department
  const departmentCol = document.createElement("td");
  const pill = document.createElement("div"); // Department pill div
  pill.className = `pill pill-${stringToKebabCase(intern.department)}`;
  pill.innerHTML = `<b>${intern.department}</b>`;
  departmentCol.appendChild(pill);
  row.appendChild(departmentCol);

  return row;
}

export async function displayInternTable() {
  const filterSelections = getSelectedOptions();

  // Fetches, Filters, and Searches for Interns
  const interns = searchInterns(
    filterByDepartment(
      filterByLocation(
        Object.entries(await getInterns()).map(([intern, internInfo]) => ({
          name: intern,
          ...internInfo,
        })),
        filterSelections.Location,
      ),
      filterSelections.Departments,
    ),
    currentSearchQuery,
  );

  renderDepartmentLists("department-list-1");
  const tableHeader = document.getElementById("interns-table-header");
  tableHeader.innerHTML = "";

  interns.length === 0
    ? (tableHeader.innerHTML = `<tr><th>There are no interns listed</th></tr>`)
    : (tableHeader.innerHTML = `<tr><th>Select</th><th>Intern</th><th>Location</th><th>Department</th></tr>`);

  const tableBody = document.getElementById("interns-table-body");
  tableBody.innerHTML = ""; //clear out any previous pairings

  for (const intern of interns) {
    tableBody.appendChild(formatInternDetails(intern));
  }

  document.getElementById("select-all").addEventListener("click", () => {
    const buttons = document.querySelectorAll(".pill-select");
    buttons.forEach((button) => {
      button.textContent = "Deselect";
      button.classList.remove("pill-select");
      button.classList.add("pill-selected");
      internsSet.add(button.closest("tr").dataset.name);
    });
  });

  document.getElementById("deselect-all").addEventListener("click", () => {
    const buttons = document.querySelectorAll(".pill-selected");
    buttons.forEach((button) => {
      button.textContent = "Select";
      button.classList.remove("pill-selected");
      button.classList.add("pill-select");
      internsSet.delete(button.closest("tr").dataset.name);
    });
  });
}
export function updateInternsTable(newInterns, isAdd) {
  const tableBody = document.getElementById("interns-table-body");
  const rows = tableBody.querySelectorAll("tr");

  // Finds every intern that we added and updates their selection
  newInterns.forEach((newIntern) => {
    rows.forEach((row) => {
      const nameCell = row.cells[1];
      const locationCell = row.cells[2];
      const departmentCell = row.cells[3];
      const selectButton = row.querySelector("button");

      if (
        nameCell.textContent !== newIntern.name ||
        locationCell.textContent !== newIntern.location ||
        departmentCell.textContent !== newIntern.department
      ) {
        return;
      }
      if (isAdd) {
        selectButton.textContent = "Deselect";
        selectButton.classList.add("pill-selected");
        selectButton.classList.remove("pill-select");
      } else {
        selectButton.textContent = "Select";
        selectButton.classList.add("pill-select");
        selectButton.classList.remove("pill-selected");
      }
    });
  });
}

function getSelectedInterns() {
  const selectedInterns = [];
  const rows = document.querySelectorAll("#interns-table-body tr");

  rows.forEach((row) => {
    const selectButton = row.querySelector(".pill-selected");
    if (selectButton == null) {
      return;
    }
    selectedInterns.push({
      name: row.cells[1].textContent,
      location: row.cells[2].textContent,
      department: row.cells[3].textContent,
      email: row.dataset.email,
    });
  });

  return selectedInterns;
}

export function getUnselectedInterns() {
  const unselectedInterns = [];
  const rows = document.querySelectorAll("#interns-table-body tr");

  rows.forEach((row) => {
    const selectButton = row.querySelector(".pill-select");
    if (selectButton == null) {
      return;
    }
    unselectedInterns.push({
      name: row.cells[1].textContent,
      location: row.cells[2].textContent,
      department: row.cells[3].textContent,
      email: row.dataset.email,
    });
  });

  return unselectedInterns;
}

// linear search
function searchInterns(interns, query) {
  const lowerCasedQuery = query.toLowerCase();
  return interns.filter(
    (intern) =>
      intern.name.toLowerCase().includes(lowerCasedQuery) ||
      intern.department.toLowerCase().includes(lowerCasedQuery) ||
      intern.location.toLowerCase().includes(lowerCasedQuery),
  );
}
