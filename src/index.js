require("dotenv").config();
const express = require('express');
const app = express();
const dbConnect = require("./db/db");
const routers = require("./routes");
const client = require("./redis/redis");
const port = 8000;

// ---- || Start Database connection || -------- //
dbConnect();

//-------- || Start the Redis Connection || -------------------- //
client.connect();

// ------ || Adding JSON middleware and Routes Middleware || ---------------------- //
app.use(express.json());
app.use(routers);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})