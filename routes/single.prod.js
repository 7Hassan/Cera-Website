
const express = require("express");
const router = express.Router();
const { singleProdFun } = require("../controllers/single.prod.ctrl");
const { getDataFunction } = require("../controllers/dataFileCtrl");

router.get("/Data", getDataFunction);
router.get("/:id", singleProdFun);


module.exports = router;