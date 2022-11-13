const express = require("express");
const path = require("path"); //node.js استعاء الباث من
const app = express();
const publicDir = path.join(__dirname, "./public"); //هنا بجيب الباث
const port = 3000;
app.use(express.static(publicDir)); //public هنا بيقراء الملاف الي موجوده ف
app.set("view engine", "hbs");

/* Rendering pages */
app.use("/", require("./routes/pages"));
/*respose to rqueste from front end */
app.use("/Data", require("./routes/data"));

/* Run server */
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
