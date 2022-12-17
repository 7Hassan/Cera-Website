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
  logIn,
  signUp } = require("../controllers/userCtrl");

/* Get */
router.get("/sinup", createAccountPageFunction);

router.get("/sinup/verify", verification);

router.get("/login", registrationPageFunction);


/* Post */
router.post("/sinup", signUp);

router.post("/sinup/check", checkEmail);

router.post("/sinup/verify", changEmailVerify);

router.post("/login", logIn);

module.exports = router;