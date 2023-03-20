const express = require("express");
const router = express.Router();

const {
  agronomes,
  ficheTechnique,
  chat,
} = require("../controllers/agriculteur");

router.route("/agronomes").get(agronomes);
router.route("/fiche-technique").get(ficheTechnique);
router.route("/chat").get(chat);

module.exports = router;
