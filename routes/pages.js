const express = require("express");
const path = "../controllers/pagesFileCtrl";
const {
  homePageFunction,
  shopPageFunction,
  aboutPageFunction,
  paymentPageFunction,
  contactPageFunction,
  blogPageFunction,
} = require(path);

const router = express.Router();

router.get("/", homePageFunction);
router.get("/index.hbs", homePageFunction);
router.get("/shop.hbs", shopPageFunction);
router.get("/about.hbs", aboutPageFunction);
router.get("/payment.hbs", paymentPageFunction);
router.get("/contact.hbs", contactPageFunction);
router.get("/blog.hbs", blogPageFunction);

module.exports = router;
