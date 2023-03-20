const express = require("express");
const sellersController = require("../controllers/sellers");

const router = express.Router();

router.post("/sing-up", sellersController.register);

module.exports = router;
