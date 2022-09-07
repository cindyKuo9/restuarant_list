//MongoDB setting
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

//MongoDB connection status
const db = mongoose.connection
db.on('error', () => {
  console.log('mongoose error.')
})
db.once('open', () => {
  console.log('mongodb connected.')
})

module.exports = db