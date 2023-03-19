const express = require("express");
const router = express.Router();

const { agronomes, ficheTechnique } = require("../controllers/agriculteur");

router.route("/agronomes").get(agronomes);
router.route("/fiche-technique").get(ficheTechnique);

module.exports = router;
