const db = require("./connectdb");
const { BadRequest } = require("../errors");

const addAgronome = (name, email, password, speciality, experience) => {
  db.query(
    "INSERT INTO agronome SET ?",
    {
      name: name,
      email: email,
      password: password,
      speciality: speciality,
      experience: experience,
    },
    (error, results, fields) => {
      if (error) {
        console.log(error);
      }
    }
  );
};
const getAllAgronome = async () => {
  db.query("SELECT * FROM agronome", async (error, results, fields) => {
    if (error) {
      throw error;
    } else {
      // console.log("This solution is:", results);
      const agronome = await results;
      return agronome;
    }
  });
};

module.exports = { addAgronome, getAllAgronome };
