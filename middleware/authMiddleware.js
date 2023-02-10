const jwt = require("jsonwebtoken");
const CustomAPIError = require("../errors/custom-error");

const authenticationMiddleware = async (req, res, next) => {
  // console.log(req.headers.authorization);
  const authHeader = req.headers.authorization;
  //   console.log(authHeader);

  //   verifying if header or token are provided in sigin request
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new CustomAPIError("please provide token", 400);
  }

  //   extracting the token from the header, removing the Bearer

  const token = authHeader.split(" ")[1];
  //   console.log(token);
  //   now let's verify the obtained token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    const { name, email } = decoded;
    req.user = { name, email };
    next();
  } catch (error) {
    throw new CustomAPIError("Not authorised to access this route", 401);
  }
};

module.exports = authenticationMiddleware;
