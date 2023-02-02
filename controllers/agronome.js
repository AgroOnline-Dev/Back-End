// importing modules
const db = require("../db/connectdb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const CustomAPIError = require("../errors/custom-error");

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    throw new CustomAPIError("Please provide name, email and password", 400);
  }

  //   normally we are supposed to send back in the payload the id of the user, but since for now i've not yet made the connection to the db, i'm just going to return the email and a dummy id of the person since it is even a unique info

  // add a normal id later
  const id = 13;

  const salt = await bcrypt.genSalt(10);
  console.log(salt);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log(hashedPassword);
  //   try to keep the payload small due to internet traffic
  //   look for a much more longer secret

  const token = jwt.sign({ name, email }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  db.query(
    "INSERT INTO agronome SET ?",
    { id: id, name: name, email: email, password: password },
    (error, results, fields) => {
      if (error) {
        throw error;
      } else {
        console.log(results);
        console.log("successfull");
      }
    }
  );

  //   db.query("SELECT * FROM agronome", (error, results, fields) => {
  //     if (error) {
  //       throw error;
  //     } else {
  //       console.log("This solution is:", results);
  //     }
  //   });

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

  res
    .status(200)
    .json({ msg: `user ${name} with email ${email} created`, token });
};

const signin = async (req, res) => {
  //   console.log(req.user);

  const decodedInfo = req.user;
  const luckyNumber = Math.floor(Math.random() * 100);
  res.status(200).json({
    msg: `Hello, ${decodedInfo.name}`,
    secret: `Here is your authorisez data, lucky number ${luckyNumber}`,
  });
};

module.exports = {
  signin,
  signup,
};
