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
const Restaurant = require('./models/restaurant')

const bodyParser = require('body-parser')


//setting static files
app.use(express.static('public'))

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


app.use(bodyParser.urlencoded({ extended: true }))

//set route
//get 
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

app.get('/search', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurantList => {
      const restuarants = restaurantList.filter(restaurant => {
        if (restaurant.name.toLowerCase().includes(req.query.keyword.toLowerCase())) {
          return true;
        } else {
          return restaurant.category.toLowerCase().includes(req.query.keyword.toLowerCase())
        }
      })
      res.render('index', { restaurants: restuarants, keyword: req.query.keyword })
    })
    .catch(error => console.log(error))
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => {
      res.render('show', { restaurant })
    })
    .catch(error => console.log(error))
})

app.get('/restaurants', (req, res) => {
  res.render('new')
})

//post
app.post('/restaurants', (req, res) => {
  Restaurant.create(req.body)
    .then(() => { res.redirect('/') })
    .catch(error => console.log(error))
})

app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .then(restaurant => { restaurant.remove() })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


//listen on server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})