const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const passport = require("passport");

router.post("/login", passport.authenticate("local"), authController.loginUser);
router.get("/login", authController.getProfile);
module.exports = router;
