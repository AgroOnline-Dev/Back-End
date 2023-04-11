const db = require("./connectdb");
const { BadRequest } = require("../errors");

const addUser = (name, email, password, profil) => {
  db.query(
    "INSERT INTO users SET ?",
    {
      name: name,
      email: email,
      password: password,
    },
    (err, results) => {
      if (err) {
        console.log(err);
      }
    }
  );
};

module.exports = { addUser };
