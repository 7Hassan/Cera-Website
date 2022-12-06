
const express = require("express");
const router = express.Router();
const { singleProdFun, notFoundPage } = require("../controllers/pagesFileCtrl");
// const { getDataFunction } = require("../controllers/dataFileCtrl");

// router.get("/Data", getDataFunction);
router.get("/:id", singleProdFun);
// router.get("/*", notFoundPage);
// router.use((req, res) => {
//   res.status(404).render('404', { title: 404 });
// })



module.exports = router;