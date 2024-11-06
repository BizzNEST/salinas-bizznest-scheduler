import express from "express";
import cors from "cors";

import shuffle from "../src/util/shuffle.js";
import pair from "../src/util/pair.js";
import { uniquePairing } from "../src/util/uniquePairing.js";

const app = express();
const PORT = 8000;

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

  try {
    // Send the file content directly in the response
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", 'attachment; filename="pairs.json"');
    res.send(jsonContent);
  } catch (err) {
    console.error("Error exporting pairs:", err);
    res.status(500).send("Error exporting pairs");
  }
});
