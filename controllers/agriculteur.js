const db = require("../Model/connectdb");

const agronomes = async (req, res) => {
  db.query("SELECT * FROM agronome", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
};

module.exports = agronomes;
