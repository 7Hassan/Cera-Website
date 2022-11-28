const express = require("express");
const path = require("path"); //node.js استعاء الباث من
const db = require("./config/dataBase"); //connect with databse
const app = express();
const publicDir = path.join(__dirname, "./public"); //هنا بجيب الباث
const port = 3000;
app.use(express.static(publicDir)); //public هنا بيقراء الملاف الي موجوده ف
app.set("view engine", "ejs");

/* Rendering pages */
app.use("/", require("./routes/pages"));
// single product
app.use("/shop", require("./routes/single.prod"));

/*respose to rqueste from front end */
app.use("/Data", require("./routes/data"));

/* Run server */
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
