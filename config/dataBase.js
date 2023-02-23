const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASEURL, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("database connected");

  }
});
