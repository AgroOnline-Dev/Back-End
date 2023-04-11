// importing modules
const { addUser } = require("../Model/users");
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
  addUser(name, email, password);
  res.status(StatusCodes.CREATED).json({
    msg: `user ${name} with email ${email} created`,
    token,
    stauts: 1,
  });
};

const signin = async (req, res) => {
  const token = req.token;

  res.status(StatusCodes.ACCEPTED).json({
    msg: token,
    status: 1,
  });
};

// controller to modify user profile
const getInfos = (req, res, next) => {
  const requete = req.body;
  const token = requete.token;
  const user = jwt.verify(token, process.env.JWT_SECRET);
  res.json({ user: user, status: 0 });
};
// controller to view all agricultures under an agronomist with their appreciations

module.exports = {
  signin,
  signup,
  getInfos,
};
