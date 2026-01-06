const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  forgetPassword,
  resetPassword,
} = require("../controllers/UserController");
const router = express.Router();
const { validateJWTToken } = require("../middlewares/authorizationMiddleware");


router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/getCurrentUser", validateJWTToken, currentUser);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword", resetPassword);

module.exports = router;

