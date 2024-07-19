const moongoes = require("mongoose");
const connect = async () => {
  try {
    let db = "mongodb://localhost:27017/node-auth";
    await moongoes.connect(db);
    console.log("Database connection successfully!!!");
  } catch (error) {
    console.log("Database connection failed", error);
  }
};
module.exports = connect;
