//! Error uncaught Exception
process.on('uncaughtException', (err) => {
  console.log('⛔ ' + err.name, err.message, err.stack)
  process.exit(1)
})


const mongoose = require('mongoose')
const app = require('./app')
const dataLink = process.env.DATA_BASE_URL.replace('<DATABASENAME>', process.env.DATA_BASE_NAME).replace('<PASSWORD>', process.env.DATA_BASE_PASSWORD)

//? connect with DataBase
mongoose.connect(dataLink).then(() => console.log('✅ connect with DataBase'))
//? Run server 
const port = process.env.PORT
const server = app.listen(port, () => console.log(`✅ app listening on port ${port}`))


//! Error with connection with mongo
process.on('unhandledRejection', (err) => {
  console.log('🚨 ' + err.name, err.message)
  server.close(() => process.exit(1))
})