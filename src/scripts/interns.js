import getInterns from "../api/interns/service.js";
import shuffle from "../util/shuffle.js";
import pair from "../util/pair.js";
import { filterByLocation, uniquePairing } from "./filters.js";
import { filterByDepartment, getSelectedOptions } from "./filters.js";

async function pairInterns() {
  let interns = getSelectedInterns();
  interns = filterByDepartment(filterByLocation(interns));
  shuffle(interns);
  uniquePairing(interns);
  return pair(interns);
}

function formatInternWeekDetails(intern) {
  const col = document.createElement("td"); //Create column for intern
  const internInfo = document.createElement("div"); //Column info div
  internInfo.className = "intern-pill-name-location";

  const pill = document.createElement("div"); //Department pill div
  pill.className = "pill";
  pill.innerHTML = `<b>${intern.department}</b>`;
  internInfo.appendChild(pill);

  const name = document.createElement("p"); //Name
  name.textContent = intern.name;
  internInfo.appendChild(name);

  const location = document.createElement("p"); //Location
  location.textContent = intern.location;
  internInfo.appendChild(location);

  col.appendChild(internInfo);

  return col;
}

export async function displayInternWeekTable() {
  const internPairs = await pairInterns();

  const tableHeader = document.getElementById("interns-week-table-header");
  tableHeader.innerHTML = "";

  internPairs.length === 0
    ? (tableHeader.innerHTML = `<tr><th>Not enough Interns selected to pair.</th></tr>`)
    : (tableHeader.innerHTML = `<tr><th>Group</th><th>Intern 1</th><th>Intern 2</th></tr>`);

  const tableBody = document.getElementById("interns-week-table-body");
  tableBody.innerHTML = ""; //clear out any previous pairings

  internPairs.forEach((pair, index) => {
    const row = document.createElement("tr"); //creating group row

    const groupNum = document.createElement("td"); //Group num column
    groupNum.textContent = "Group " + (index + 1);
    row.appendChild(groupNum);

    //add intern info columns
    for (const intern of pair) {
      row.appendChild(formatInternWeekDetails(intern));
    }

    //add to table
    tableBody.appendChild(row);
  });
}

function formatInternDetails(intern, index) {
  const row = document.createElement("tr"); // Create a row for the intern
  row.dataset.index = index; // Add a unique identifier to the row

  // Create column for the select button
  const selectCol = document.createElement("td");
  const selectButton = document.createElement("button");
  selectButton.className = "pill-select";
  selectButton.textContent = "Select";
  selectButton.addEventListener("click", function () {
    if (selectButton.classList.contains("pill-select")) {
      selectButton.textContent = "Selected";
      selectButton.classList.remove("pill-select");
      selectButton.classList.add("pill-selected");
    } else {
      selectButton.textContent = "Select";
      selectButton.classList.remove("pill-selected");
      selectButton.classList.add("pill-select");
    }
  });
  selectCol.appendChild(selectButton);
  row.appendChild(selectCol);

  // Create column for the intern name
  const nameCol = document.createElement("td");
  nameCol.textContent = intern.name;
  row.appendChild(nameCol);

  // Create column for the intern location
  const locationCol = document.createElement("td");
  locationCol.textContent = intern.location;
  row.appendChild(locationCol);

  // Create column for the intern department
  const departmentCol = document.createElement("td");
  const pill = document.createElement("div"); // Department pill div
  pill.className = "pill";
  pill.innerHTML = `<b>${intern.department}</b>`;
  departmentCol.appendChild(pill);
  row.appendChild(departmentCol);

  return row;
}

export async function displayInternTable() {
  const interns = Object.entries(await getInterns()).map(
    ([intern, internInfo]) => ({
      name: intern,
      ...internInfo,
    }),
  );

  const tableHeader = document.getElementById("interns-table-header");
  tableHeader.innerHTML = "";

  interns.length === 0
    ? (tableHeader.innerHTML = `<tr><th>There are no interns listed</th></tr>`)
    : (tableHeader.innerHTML = `<tr><th>Select</th><th>Intern</th><th>Location</th><th>Department</th></tr>`);

  const tableBody = document.getElementById("interns-table-body");
  tableBody.innerHTML = ""; //clear out any previous pairings

  for (const intern of interns) {
    const row = formatInternDetails(intern);
    tableBody.appendChild(row);
  }

  document.getElementById("select-all").addEventListener("click", () => {
    const buttons = document.querySelectorAll(".pill-select");
    buttons.forEach((button) => {
      button.textContent = "Selected";
      button.classList.remove("pill-select");
      button.classList.add("pill-selected");
    });
  });

  document.getElementById("deselect-all").addEventListener("click", () => {
    const buttons = document.querySelectorAll(".pill-selected");
    buttons.forEach((button) => {
      button.textContent = "Select";
      button.classList.remove("pill-selected");
      button.classList.add("pill-select");
    });
  });
}

function getSelectedInterns() {
  const selectedInterns = [];
  const rows = document.querySelectorAll("#interns-table-body tr");

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

// TODO: Use this search for interns card / week cards
function findInterns(interns, query) {
  const lowerCasedQuery = query.toLowerCase();
  return interns.filter(
    (intern) =>
      intern.name.toLowerCase().includes(lowerCasedQuery) ||
      intern.department.toLowerCase().includes(lowerCasedQuery) ||
      intern.location.toLowerCase().includes(lowerCasedQuery),
  );
}
