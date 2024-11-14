/*export function displayExportButton() {
  //get export button div & clear if re-generated
  const parentContainer = document.getElementById("export-button-div");
  parentContainer.innerHTML = "";

  // Create the button
  const exportButton = document.createElement("button");
  exportButton.className = "filter-button export-button";
  exportButton.id = "export-button";
  exportButton.type = "button";
  exportButton.innerHTML = `Export <i class="fa-solid fa-file-arrow-down"></i>`;
  parentContainer.appendChild(exportButton);

  //convert HTML table to CSV on click of the button
  exportButton.addEventListener("click", function () {
    tableToCSV();
  });
}*/

//import { exportPairs } from "../api/interns/service.js";

export function displayExportButton() {
  //get export button div & clear if re-generated
  const parentContainer = document.getElementById("export-button-div");
  parentContainer.innerHTML = "";

  //Create anchor tag to download
  const fileTag = document.createElement("a");
  fileTag.id = "server-export";
  fileTag.style = "text-decoration:none";

  // Create the button
  const exportButton = document.createElement("button");
  exportButton.className = "filter-button export-button";
  exportButton.id = "export-button";
  exportButton.type = "button";
  exportButton.innerHTML = `Export <i class="fa-solid fa-file-arrow-down"></i>`;
  parentContainer.appendChild(fileTag);
  fileTag.appendChild(exportButton);

  //convert HTML table to CSV on click of the button
  /*exportButton.addEventListener("click", function () {
    //tableToCSV();
    exportPairs();
  });*/
}

export function tableToCSV() {
  // Variable to store the final csv data
  let csv_data = [];

  //add custom header to CSV
  csv_data.push(
    "Group, (Intern 1) Name, (Intern 1) Department, (Intern 1) Location, (Intern 2) Name, (Intern 2) Department, (Intern 2) Location",
  );

  // Get each row data by getting table and starting after header
  const rows = document
    .getElementById("interns-week-table")
    .getElementsByTagName("tr");
  for (let i = 1; i < rows.length; i++) {
    // Get each column data
    const cols = rows[i].querySelectorAll("td,th");

    //If more than 3 columns means a group of 3 so we have to modify header
    if (cols.length > 3) {
      for (let i = 3; i < cols.length; i++) {
        csv_data[0] =
          csv_data[0] +
          `, (Intern ${i}) Name, (Intern ${i}) Department, (Intern ${i}) Location`;
      }
    }

    // Stores each csv row data
    const csvrow = [];
    for (let j = 0; j < cols.length; j++) {
      // Get the text data of each cell
      const internText = cols[j].innerText.replace(/\n\n/g, ",");
      //separate info within same column
      const separateInfo = internText.split(",");

      // If only one item push it, if not reorganize to match header
      separateInfo.length === 1
        ? csvrow.push(internText)
        : csvrow.push(
            `${separateInfo[2]}, ${separateInfo[0]}, ${separateInfo[1]} `,
          );
    }

    // Combine each column value with comma
    csv_data.push(csvrow.join(","));
  }
  // Combine each row data with new line character
  csv_data = csv_data.join("\n");

  downloadCSVFile(csv_data);
}

export function downloadCSVFile(csv_data) {
  // Create CSV file object and feed our
  // csv_data into it
  const CSVFile = new Blob([csv_data], { type: "text/csv" });

  // Create to temporary link to initiate
  // download process
  const temp_link = document.createElement("a");

  // Download csv file
  temp_link.download = "InternPairs.csv";
  const url = window.URL.createObjectURL(CSVFile);
  temp_link.href = url;

  // This link should not be displayed
  temp_link.style.display = "none";
  document.body.appendChild(temp_link);

  // Automatically click the link to trigger download
  temp_link.click();
  document.body.removeChild(temp_link);
}
