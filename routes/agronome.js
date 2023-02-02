const express = require("express");
const router = express.Router();
const { signin, signup } = require("../controllers/agronome");
const authenticationMiddleware = require("../middleware/authMiddleware");

router.route("/signin").get(authenticationMiddleware, signin);
router.route("/signup").post(signup);

module.exports = router;
