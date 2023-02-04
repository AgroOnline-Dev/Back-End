// importing modules
const { addAgronome, getAllAgronome, findEmail } = require("../Model/agronome");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { BadRequest } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const db = require("../Model/connectdb");

const signup = async (req, res) => {
  const { name, email } = req.body;
  const password = req.password;
  const token = req.token;
  if (!email || !password || !name) {
    throw new BadRequest("Please provide name, email and password");
  }

  addAgronome(name, email, password);

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

module.exports = {
  signin,
  signup,
};
