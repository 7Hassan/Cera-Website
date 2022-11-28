const express = require("express");
const path = "../controllers/pagesFileCtrl";
const {
  homePageFunction,
  shopPageFunction,
  aboutPageFunction,
  paymentPageFunction,
  contactPageFunction,
  blogPageFunction,
  registrationPageFunction,
  createAccountPageFunction,
} = require(path);

const router = express.Router();

router.get("/", homePageFunction);
router.get("/shop", shopPageFunction);
router.get("/about", aboutPageFunction);
router.get("/payment", paymentPageFunction);
router.get("/registration", registrationPageFunction);
router.get("/contact", contactPageFunction);
router.get("/blog", blogPageFunction);
router.get("/createAccount", createAccountPageFunction);


module.exports = router;
