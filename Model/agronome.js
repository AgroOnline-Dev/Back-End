const db = require("./connectdb");
const { BadRequest } = require("../errors");

const addAgronome = (name, email, password) => {
  db.query(
    "INSERT INTO agronome SET ?",
    { name: name, email: email, password: password },
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

// const a = getAllAgronome();
// console.log(a);

//   db.query(
//     "SELECT email FROM agronome WHERE email = ? ",
//     [email],
//     (error, result) => {
//       if (error) {
//         console.log(error);
//       } else {
//         if (result.length > 0) {
//           return res.json({ msg: `user with email ${email} already exist  ` });
//         }
//       }
//     }
//   );

module.exports = { addAgronome, getAllAgronome };
