const express = require("express");
const userController = require("../controllers/users");
const uploadP = require("../config/multer-config-profils");
const router = express.Router();

router.get("/users", userController.getUsers);
router.post("/sing-up", uploadP.single("profil"), userController.register);
router.post("/login", userController.loginUser);
router.get("/logout", userController.logOut);
router.get("/user-by-id", userController.getUserById);
router.put("/update-user", userController.updateUser);
router.get("/login", userController.verificationToken);
module.exports = router;
