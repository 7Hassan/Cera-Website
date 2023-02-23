const express = require("express");
db = require("../config/dataBase");
const router = express.Router();




const {
  registrationPageFunction,
  createAccountPageFunction,
  checkEmail,
  checkUser,
  verificationPage,
  changEmailVerify,
  confirmationEmail,
  logIn,
  signUp } = require("../controllers/authCtrl");



/* Get */
router.get("/sinup", checkUser, createAccountPageFunction);
router.get("/login", checkUser, registrationPageFunction);

router.get("/sinup/verify", verificationPage);
router.get("/sinup/verify/:emailActivationCode", confirmationEmail,verificationPage);



/* Post */
router.post("/sinup", signUp);

router.post("/sinup/check", checkEmail);

router.post("/sinup/verify", changEmailVerify);

router.post("/login", logIn);

module.exports = router;