// include express
const express = require("express")
const app = express()

//include express-handlebars
const exphbs = require('express-handlebars')
// set template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//MongoDB setting
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

//setting static files
app.use(express.static('public'))

//JSON
const restaurantList = require('./restaurant.json')

// set server related variable
const port = 3000

//MongoDB connection status

const db = mongoose.connection
db.on('error', () => {
  console.log('mongoose error.')
})
db.once('open', () => {
  console.log('mongodb connected.')
})

//set route 
app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
})

app.get('/search', (req, res) => {
  const restuarants = restaurantList.results.filter(restaurant => {
    if (restaurant.name.toLowerCase().includes(req.query.keyword.toLowerCase())) {
      return true;
    } else {
      return restaurant.category.toLowerCase().includes(req.query.keyword.toLowerCase())
    }
  })
  res.render('index', { restaurants: restuarants, keyword: req.query.keyword })
})

app.get('/restaurants/:id', (req, res) => {
  const restaurant = restaurantList.results.find(restuarant => restuarant.id.toString() === req.params.id)
  res.render('show', { restaurant: restaurant })
})

//listen on server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})