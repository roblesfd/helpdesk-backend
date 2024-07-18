const authController = require("../controllers/authController");
const express = require("express");
const router = express.Router();
const loginLimiter = require("../middleware/loginLimiter");

router.route("/").post(loginLimiter, authController.login);

router.route("/refresh").get(authController.refresh);

router.route("/logout").post(authController.logout);

router.route("/confirmar/:token").get(authController.confirm);

module.exports = router;
