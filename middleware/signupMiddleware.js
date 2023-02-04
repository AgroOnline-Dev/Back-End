const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const db = require("../Model/connectdb");

const signUpMiddleware = async (req, res, next) => {
  const { name, email, password } = req.body;
  db.query(
    "SELECT email FROM agronome WHERE email = ? ",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        if (results.length > 0) {
          return res
            .status(StatusCodes.CONFLICT)
            .json({ msg: `user with email ${email} already exist  ` });
        } else {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          const token = jwt.sign({ name, email }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_LIFETIME,
          });
          req.password = hashedPassword;
          req.token = token;
          next();
        }
      }
    }
  );
};

module.exports = signUpMiddleware;
