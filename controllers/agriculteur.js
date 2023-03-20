const db = require("../Model/db");

const agronomes = async (req, res) => {
  db.query(
    "SELECT id, name, email, speciality, experience,profile_image FROM agronome",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
};
const ficheTechnique = async (req, res) => {
  db.query("SELECT id,nom from fichestechniques", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
};

const chat = async (req, res) => {
  db.query("SELECT room, user,contenu  from messages", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
};

module.exports = { agronomes, ficheTechnique, chat };
