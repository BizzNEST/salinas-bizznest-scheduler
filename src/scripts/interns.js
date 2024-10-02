import getInterns from "../api/interns/service.js";
import shuffle from "../util/shuffle.js";
import pair from "../util/pair.js";

async function pairInterns() {
  const interns = [];
  const departments = await getInterns();
  for (const department in departments) {
    for (const [intern, internInfo] of Object.entries(
      departments[department],
    )) {
      interns.push({
        name: intern,
        department: internInfo.department,
        location: internInfo.location,
      });
    }
  }
  shuffle(interns);
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

  const tableHeader = document.getElementById("interns-table-header");
  tableHeader.innerHTML = "";
  tableHeader.innerHTML = `<tr><th>Group</th><th>Intern 1</th><th>Intern 2</th></tr>`;

  const tableBody = document.getElementById("interns-table-body");
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
