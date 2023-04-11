const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const db = require("../Model/connectdb");

const signUpMiddleware = async (req, res, next) => {
  const { name, email, password } = req.body;
  const profil = `http://lochost:5000/sing-up/${req.file.filename}`;
  db.query(
    "SELECT email FROM users WHERE email = ? ",
    [email],
    async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        if (results.length > 0) {
          return res
            .status(StatusCodes.BAD_REQUEST)
            .json({
              msg: `user with email ${email} already exists  `,
              status: 0,
            });
        } else {
          const salt = await bcrypt.genSalt(10);
          // console.log(salt);
          const hashedPassword = await bcrypt.hash(password, salt);
          const token = jwt.sign({ name, email }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
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
