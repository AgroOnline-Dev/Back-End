const db = require("./connectdb");

const addUSER = () => {
  db.query(
    "INSERT INTO agronome SET ?",
    { name: name, email: email, password: password },
    (error, results, fields) => {
      if (error) {
        throw error;
      } else {
        console.log(results);
        console.log("successfull");
      }
    }
  );
};

module.exports = { addUSER };
