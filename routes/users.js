const express = require("express");
db = require("../config/dataBase");
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/users');


const {
  registrationPageFunction,
  createAccountPageFunction,
  checkEmail,
  verification,
  changEmailVerify,
  confirmationEmail,
  logIn,
  signUp } = require("../controllers/userCtrl");


let checkSession = (req, res, next) => {
  if (req.session.user && req.cookies.user_side) {
    res.redirect("/");

    console.log(req.session.id)
  } else {
    next();
  }
}
/* Get */
router.get("/sinup", checkSession, createAccountPageFunction);

router.get("/sinup/verify", verification);

router.get("/sinup/verify/:emailActivationCode", confirmationEmail);

router.get("/login", checkSession, registrationPageFunction);


/* Post */
router.post("/sinup", signUp);

router.post("/sinup/check", checkEmail);

router.post("/sinup/verify", changEmailVerify);

router.post("/login", logIn);

module.exports = router;