import getInterns from "../api/interns/service.js";
import shuffle from "../util/shuffle.js";
import pair from "../util/pair.js";
import { filterByLocation, uniquePairing } from "./filters.js";
import { filterByDepartment, getSelectedOptions } from "./filters.js";

async function pairInterns() {
  let interns = [];
  const fetchedInterns = await getInterns();
  for (const [intern, internInfo] of Object.entries(fetchedInterns)) {
    interns.push({
      name: intern,
      department: internInfo.department,
      location: internInfo.location,
    });
  }

  interns = filterByDepartment(filterByLocation(interns));

  shuffle(interns);
  uniquePairing(interns);
  return pair(interns);
}

function formatInternDetails(intern) {
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

export async function displayInternTable() {
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
      row.appendChild(formatInternDetails(intern));
    }

    //add to table
    tableBody.appendChild(row);
  });
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
