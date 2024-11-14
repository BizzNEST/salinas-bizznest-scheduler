import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

import shuffle from "../src/util/shuffle.js";
import { uniquePairing } from "../src/util/uniquePairing.js";
import pair from "../src/util/pair.js";

const app = express();

const port = 8000;
let internData = {};
app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});

//PRACTICE API Call
/*app.post("/apicall", (req, res) => {
  //console.log(req.body);
  const { x, y } = req.body;
  console.log(x * y);
});*/

app.post("/generate-pairs", (req, res) => {
  const { interns, pairingType } = req.body;

  shuffle(interns);
  uniquePairing(interns, pairingType);
  const pairedInterns = pair(interns);
  internData = { pairs: pairedInterns };
  res.json(internData);
});

app.get("/export-pairs", (req, res) => {
  try {
    //JSON file implementation
    //const data = JSON.stringify(internData);
    //const filePath = path.join(process.cwd(), "docs", "internData.json");

    const data = JSONToCSV();
    const filePath = path.join(process.cwd(), "docs", "internData.csv");

    fs.writeFileSync(filePath, data, (err) => err && console.error(err));
    console.log("CSV data saved to file successfully.");

    res.download(filePath, "internData.csv", (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error downloading file");
      }
    });
  } catch (error) {
    console.error("Error writing JSON data to file:", error);
  }
});

export function JSONToCSV() {
  // Variable to store the final csv data
  const dataArr = internData.pairs;
  let csv_data = [];

  //add custom header to CSV
  csv_data.push(
    "Group, (Intern 1) Name, (Intern 1) Department, (Intern 1) Location, (Intern 2) Name, (Intern 2) Department, (Intern 2) Location",
  );

  // Get each row data by getting table and starting after header
  const rows = dataArr.length;
  for (let i = 0; i < rows; i++) {
    // Get each column data
    const cols = dataArr[i];

    //Group of 3 or more so we have to modify header
    if (cols.length > 2) {
      for (let i = 2; i < cols.length; i++) {
        csv_data[0] =
          csv_data[0] +
          `, (Intern ${i + 1}) Name, (Intern ${i + 1}) Department, (Intern ${i + 1}) Location`;
      }
    }

    // Stores each csv row data
    const csvrow = [];
    // Add Group Number
    csvrow.push(i + 1);
    for (let j = 0; j < cols.length; j++) {
      //Add Intern Data
      csvrow.push(cols[j].name);
      csvrow.push(cols[j].department);
      csvrow.push(cols[j].location);
    }

    // Combine each column value with comma
    csv_data.push(csvrow.join(","));
  }
  // Combine each row data with new line character
  csv_data = csv_data.join("\n");

  return csv_data;
}
