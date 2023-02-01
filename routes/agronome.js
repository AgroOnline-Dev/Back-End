const express = require("express");

const router = express.Router();

const { signin, signup } = require("../controllers/agronome");

router.route("/signup").post(signup);
router.route("/signin").get(signin);

module.exports = router;
