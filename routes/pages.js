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
router.get("/index.hbs", homePageFunction);
router.get("/shop.hbs", shopPageFunction);
router.get("/about.hbs", aboutPageFunction);
router.get("/payment.hbs", paymentPageFunction);
router.get("/registration.hbs", registrationPageFunction);
router.get("/contact.hbs", contactPageFunction);
router.get("/blog.hbs", blogPageFunction);
router.get("/createAccount.hbs", createAccountPageFunction);

module.exports = router;
