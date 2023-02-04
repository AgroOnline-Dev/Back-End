const express = require("express");
const router = express.Router();
const { signin, signup } = require("../controllers/agronome");
const authenticationMiddleware = require("../middleware/signInMiddleware");
const signUpMiddleware = require("../middleware/signupMiddleware");

router.route("/signin").get(authenticationMiddleware, signin);
router.route("/signup").post(signUpMiddleware, signup);

module.exports = router;
