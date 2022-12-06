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
router.get("/shop", shopPageFunction);
router.get("/about", aboutPageFunction);
router.get("/payment", paymentPageFunction);
router.get("/contact", contactPageFunction);
router.get("/blog", blogPageFunction);

module.exports = router;
