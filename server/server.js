import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import shuffle from "../src/util/shuffle.js";
import pair from "../src/util/pair.js";
import { uniquePairing } from "../src/util/uniquePairing.js";

const app = express();
const PORT = 8000;

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON request bodies

app.options("/api/export-pairs", cors());
app.options("/api/generate-pairs", cors());

app.listen(PORT, () => console.log(`Server is running on localhost:${PORT}`));

app.post("/api/generate-pairs", async (req, res) => {
  const { interns, rules } = req.body;
  if (interns == null || !Array.isArray(interns) || interns.length < 2) {
    return res.status(400).json({
      error:
        "Invalid input: interns must be an array with a minimum length of 2",
    });
  }
  shuffle(interns);
  uniquePairing(interns, rules);
  res.json({ pairs: pair(interns) });
});

app.post("/api/export-pairs", async (req, res) => {
  const { pairs } = req.body;
  if (!pairs || !Array.isArray(pairs) || pairs.length < 1) {
    return res.status(400).json({
      error: "Invalid input: pairs must be an array with a minimum length of 1",
    });
  }

  const jsonContent = JSON.stringify(pairs, null, 2);
  const filePath = path.join(__dirname, "pairs.json");

  try {
    await fs.promises.writeFile(filePath, jsonContent);

    // Send the file to the client for download
    res.download(filePath, "pairs.json", (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        return res.status(500).send("Error downloading file");
      }

      // Optionally delete the file after sending
      fs.promises.unlink(filePath).catch((unlinkErr) => {
        console.error("Error deleting file:", unlinkErr);
      });
    });
  } catch (err) {
    console.error("Error exporting pairs:", err);
    res.status(500).send("Error exporting pairs");
  }
});
