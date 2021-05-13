const express = require("express");
const validUrl = require("./config");
const app = express();
const port = 3000;
var cors = require("cors");
const scraper = require("./pageScraper");
app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
