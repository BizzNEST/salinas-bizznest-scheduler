import { stringToKebabCase } from "../util/stringToKebabCase.js";
import { unselectedInternsSet } from "../constants/constants.js";
import { getUnselectedInterns } from "./interns.js";
import { formatInternDetails } from "./interns.js";

export function displayEditModal(button, pair, interns) {
  button.onclick = function () {
    var modal = document.getElementById("edit-pair-modal");
    console.log(interns);
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

function displayInternModal(pair) {
  const modal = document.getElementsByClassName("edit-modal-content");

  const table = document.getElementById("intern-options");

  console.log(unselectedInternsSet);

  for (const intern of getUnselectedInterns()) {
    table.appendChild(formatInternDetails(intern));
    /*const row = document.createElement("tr");
    console.log(intern);
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
    //pill.className = `pill pill-${stringToKebabCase(intern.department)}`;
    pill.innerHTML = `<b>${intern.department}</b>`;
    departmentCol.appendChild(pill);
    row.appendChild(departmentCol);

    table.appendChild(row);*/
  }
}
