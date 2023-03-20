const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const mysql = require("mysql");
const db = mysql.createConnection({
  host: "agroserveur.mysql.database.azure.com",
  database: "agro",
  user: "Bdagro",
  password: "Agro2023",
});
module.exports = db;
