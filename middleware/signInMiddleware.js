const jwt = require("jsonwebtoken");
const { UnauthenticatedError, BadRequest } = require("../errors");
const db = require("../Model/connectdb");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  //   verifying if header or token are provided in sigin request
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnauthenticatedError("No token found, please provide token");
  }
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest("Please provide credentials");
  }
  db.query(
    "SELECT * FROM agronome WHERE email = ? ",
    [email],
    async (error, result, fields) => {
      if (error) {
        console.log(error);
      } else {
        if (result.length > 0) {
          const [user] = result;
          const foundPassword = user.password;
          const foundEmail = user.email;
          //   extracting the token from the header, removing the Bearer
          const token = authHeader.split(" ")[1];
          // comparing the password from database with entered one
          const isMatch = await bcrypt.compare(password, foundPassword);
          if (!isMatch) {
            // telling user his entered password doesn't match with database password for the specific email
            return res.status(StatusCodes.CONFLICT).json({
              msg: `This password ${password} does not match with this email  `,
            });
          }

          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // verifying if email from token corresponds to email entered for connection
            if (decoded.email != foundEmail) {
              return res.status(StatusCodes.CONFLICT).json({
                msg: `Not authorized to access this route because of wrong credentials`,
              });
            }
            const { name, email } = decoded;
            req.user = { name, email };
            next();
          } catch (error) {
            // response in case of an error with token such as length, validity, etc
            return res.status(StatusCodes.CONFLICT).json({
              msg: `Not authorized to access this route`,
            });
          }
        } else {
          // response in case user's email is not found in database
          return res.status(StatusCodes.CONFLICT).json({
            msg: `user do not exist `,
          });
        }
      }
    }
  );

  //   extracting the token from the header, removing the Bearer
  // const token = authHeader.split(" ")[1];

  //   now let's verify the obtained token
  //   try {
  //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //     const { name, email } = decoded;
  //     req.user = { name, email };
  //     next();
  //   } catch (error) {
  //     throw new UnauthenticatedError("Not authorised to access this route");
  //   }
};

module.exports = authenticationMiddleware;
