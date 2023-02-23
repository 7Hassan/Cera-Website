const mongoose = require('mongoose');
const dataBaseLink = process.env.DATA_BASE_URL.replace('<DATABASENAME>', process.env.DATA_BASE_NAME).replace('<PASSWORD>', process.env.DATA_BASE_PASSWORD)

//? Connect with Data Base
mongoose.connect(dataBaseLink)
  .then(() => console.log('DataBase Connected'))
  .catch((err) => console.log('🚀 ~ file: dataBase.js:6 ~ err:', err))
