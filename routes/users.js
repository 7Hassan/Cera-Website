const express = require("express");
db = require("../config/dataBase");
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/users');
// const passport = require('passport')

const {
  registrationPageFunction,
  createAccountPageFunction,
} = require("../controllers/pagesFileCtrl");
const {
  logIn,
  signUp,
} = require("../controllers/userCtrl");

router.get("/sinup", createAccountPageFunction);

router.post("/sinup", signUp)



router.get("/login", registrationPageFunction);
router.post("/login", logIn);





module.exports = router;