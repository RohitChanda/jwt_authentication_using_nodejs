require("dotenv").config();
const express = require('express');
const app = express();
const dbConnect = require("./db/db");
const routers = require("./routes");
const port = 8000;

dbConnect();
app.use(express.json());
app.use(routers);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})