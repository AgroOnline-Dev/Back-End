const express = require("express");
const router = express.Router();
const { signin, signup, getInfos } = require("../controllers/usersNew");
const uploadP = require("../config/multer-config-profils");
const authentication = require("../middleware/userSignInMiddleware");
const signUpMiddleware = require("../middleware/userSignUpMiddleWare");

router.route("/signin").post(authentication, signin);
router
  .route("/signup")
  .post(uploadP.single("profil"), signUpMiddleware, signup);
module.exports = router;

router.route("/verification").post(getInfos);
