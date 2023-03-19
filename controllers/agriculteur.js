const db = require("../Model/connectdb");

const agronomes = async (req, res) => {
  db.query(
    "SELECT id, name, email, speciality, experience,profile_image FROM agronome",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);

        // res
        //   .status(StatusCodes.CREATED)
        //   .json({ msg: `user ${name} with email ${email} created`, token });

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
      console.log(result);
      res.send(result);
    }
  });
};

module.exports = { agronomes, ficheTechnique };
