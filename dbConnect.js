const mysql = require("mysql");
const dotenv = require("dotenv").config();

//Connection avec la BD

const con = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});
// con.connect((error) => {
//   if (error) throw error;
//   console.log("Connection a la base de donnees reussie !");
// });

module.exports = con;
