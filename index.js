//! Error uncaught Exception
process.on('uncaughtException', (err) => {
  console.error('⛔ ' + err.name, err.message, err.stack)
  process.exit(1)
})

const mongoose = require('mongoose')
const app = require('./app')
const WebSocket = require('ws');

const DBLink = process.env.DATA_BASE_URL.replace('<DATABASENAME>', process.env.DATA_BASE_NAME).replace('<PASSWORD>', process.env.DATA_BASE_PASSWORD)
const port = process.env.PORT || 8000

//? connect with DataBase
mongoose.connect(DBLink).then(() => console.log('✅ connect with DataBase'))
//? Run server                                                                                                     
const server = app.listen(port, () => console.log(`✅ app listening on port ${port}`))

// WebSocket Server 
wss = new WebSocket.Server({ server })
wss.on('connection', function connection(ws) {
  console.log('✅ WebSocket connected')
  ws.on('message', function incoming(message) { console.log('📨 ', message) }) // incoming 
})

//! Error with connection with mongo                
process.on('unhandledRejection', (err) => {
  console.error('🚨 ' + err.name, err.message)
  server.close(() => process.exit(1))
})

// for the heroku 
process.on('SIGTERM', () => server.close(() => console.log('Closing Server!')))