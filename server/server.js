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
    const data = JSON.stringify(internData);
    const filePath = path.join(process.cwd(), "docs", "internData.json");

    fs.writeFileSync(filePath, data, (err) => err && console.error(err));
    console.log("JSON data saved to file successfully.");

    res.download(filePath, "internData.json", (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error downloading file");
      }
    });
  } catch (error) {
    console.error("Error writing JSON data to file:", error);
  }
});
