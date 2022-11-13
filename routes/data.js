const express = require("express");

const { getDataFunction } = require("../controllers/dataFileCtrl");

const router = express.Router();

router.get("/", getDataFunction);

module.exports = router;
