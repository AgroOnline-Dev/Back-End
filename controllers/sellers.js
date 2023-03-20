const db = require("../models/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const register = (req, res) => {
  const user = req.session.user;

  const { region } = req.body;

  db.query(
    "SELECT email from sellers WHERE email = ?",
    [user.email],
    async (err, results) => {
      if (err) {
        console.log(err);
      } else {
        if (results.length > 0) {
          return res.send({
            status: 0,
            message: "The email is already in use",
          });
        }
      }

      db.query(
        "INSERT INTO sellers SET ?",
        {
          name: user.name,
          email: user.email,
          MotPassVendeur: user.password,
          profil: user.profil,
          region: region,
        },
        (err, results) => {
          if (err) {
            console.log(err);
          } else {
            return res.send({ status: 1, message: "User registered" });
          }
        }
      );
    }
  );
};

module.exports = {
  register,
};
