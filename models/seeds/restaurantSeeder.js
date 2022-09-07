const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const restaurantList = require('../../restaurant.json')
const db = mongoose.connection

db.on('error', () => {
  console.log('mongoose error')
})

db.once('open', () => {
  console.log('mongoose connected')

  Restaurant.create(restaurantList.results)
    .then(() => { console.log("restaurantSeeder done.") })
    .catch(error => { console.log(error) })
    .finally(() => { db.close() })
})