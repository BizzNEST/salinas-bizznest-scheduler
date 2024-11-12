import express from "express";
import cors from "cors";

const app = express();

const port = 8000;
app.use(cors());

app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`);
});

app.post("/apicall", (req, res) => {
  const { x } = req.body;
  console.log(x);
  res.json({
    squared: +x * +x,
  });
});
