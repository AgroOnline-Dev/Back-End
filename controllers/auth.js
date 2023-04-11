const db = require("../models/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const loginUser = (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.send({
        status: 0,
        message: "Please Provide an email",
      });
    }

    if (!password) {
      return res.send({
        status: 0,
        message: "Please Provide a password",
      });
    }
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
      if (err) throw err;
      if (!results || !bcrypt.compare(password, results[0].password)) {
        res.send({ status: 0, message: "Email or Password is incorrect" });
      } else {
        req.session.user = results[0];
        res.status(201).send({
          status: 1,
          message: "welcome mr" + req.session.user.name,
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const getProfile = (req, res) => {
  // Utiliser req.isAuthenticated() pour vérifier si l'utilisateur est authentifié
  if (req.isAuthenticated()) {
    // Récupérer les informations de l'utilisateur à partir de req.user (qui contient les informations de l'utilisateur stockées dans la session)
    const user = req.user;

    // Retourner les informations de l'utilisateur connecté en réponse
    return res.json({ user });
  } else {
    // Retourner une réponse d'erreur si l'utilisateur n'est pas authentifié
    return res.status(401).json({ message: "Accès non autorisé" });
  }
};

module.exports = {
  loginUser,
  getProfile,
};
