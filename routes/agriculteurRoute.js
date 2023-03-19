const express = require("express");
const router = express.Router();

const agronomes = require("../controllers/agriculteur");

router.route("/agronomes").get(agronomes);

module.exports = router;
