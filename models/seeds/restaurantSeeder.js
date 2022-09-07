const db = require('../../config/mongoose')
const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurant.json')


db.once('open', () => {
  Restaurant.create(restaurantList.results)
    .then(() => { console.log("restaurantSeeder done.") })
    .catch(error => { console.log(error) })
    .finally(() => { db.close() })
})