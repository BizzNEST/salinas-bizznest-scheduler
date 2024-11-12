import express from "express";
import cors from "cors";
import shuffle from "../src/util/shuffle.js";
import { uniquePairing } from "../src/util/uniquePairing.js";
import pair from "../src/util/pair.js";

const app = express();

const port = 8000;
app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});

app.post("/apicall", (req, res) => {
  //console.log(req.body);
  const { x, y } = req.body;
  console.log(x * y);
});

app.post("/generate-pairs", (req, res) => {
  //console.log(req.body);
  const { interns, pairingType } = req.body;

  shuffle(interns);
  uniquePairing(interns, pairingType);
  const pairedInterns = pair(interns);
  res.json({ pairs: pairedInterns });
});
