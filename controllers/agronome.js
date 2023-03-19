// importing modules
const { addAgronome, getAllAgronome, findEmail } = require("../Model/agronome");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { BadRequest } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const db = require("../Model/connectdb");

const signup = async (req, res) => {
  const { name, email, speciality, experience } = req.body;
  const password = req.password;
  const token = req.token;
  if (!email || !password || !name) {
    throw new BadRequest("Please provide name, email and password");
  }

  addAgronome(name, email, password, speciality, experience);

  res
    .status(StatusCodes.CREATED)
    .json({ msg: `user ${name} with email ${email} created`, token });
};

const signin = async (req, res) => {
  const decodedInfo = req.user;
  const luckyNumber = Math.floor(Math.random() * 100);
  res.status(StatusCodes.OK).json({
    msg: `Hello, ${decodedInfo.name}`,
    secret: `Here is your authorisez data, lucky number ${luckyNumber}`,
  });
};

// controller to modify user profile
const profile = async (req, res) => {
  let sampleFile;
  let uploadPath;
  // checking if a file has been uploaded or not
  if (!req.files || Object.keys(req.files).length === 0) {
    // res.send("error");
    throw new BadRequest("No file was uploaded");
  }
  // obtaining uploaded file to save it
  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + "/upload/" + sampleFile.name;
  sampleFile.mv(uploadPath, (err) => {
    if (err) {
      // throw new BadRequest("Unknown Error");
      return res.send(err);
    }
    db.query(
      'UPDATE userprofile SET profile_image = ? WHERE id ="1"',
      [sampleFile.name],
      (err, rows) => {
        if (err) {
          console.log(err);
        } else {
          res.send("file uploaded succesfully");
        }
      }
    );
  });
};

// controller to view all agricultures under an agronomist with their appreciations

const agriculturers = async (req, res) => {
  db.query("SELECT * FROM agriculturer", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res.send(result);
    }
  });
};

module.exports = {
  signin,
  signup,
  profile,
  agriculturers,
};
