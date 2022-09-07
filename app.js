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

const methodOverride = require('method-override')

//setting static files
app.use(express.static('public'))
app.use(methodOverride('_method'))

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
    .catch(err => {
      console.log(err)
      res.render('error', { error: err.message })
    })
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
    .catch(err => {
      console.log(err)
      res.render('error', { error: err.message })
    })
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => {
      res.render('show', { restaurant })
    })
    .catch(err => {
      console.log(err)
      res.render('error', { error: err.message })
    })
})

app.get('/restaurants', (req, res) => {
  res.render('new')
})

app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .lean()
    .then(restaurant => {
      console.log()
      res.render('edit', { restaurant })
    })
    .catch(err => {
      console.log(err)
      res.render('error', { error: err.message })
    })
})

//post
app.post('/restaurants', (req, res) => {
  Restaurant.create(req.body)
    .then(() => { res.redirect('/') })
    .catch(err => {
      console.log(err)
      res.render('error', { error: err.message })
    })
})

app.delete('/restaurants/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .then(restaurant => { restaurant.remove() })
    .then(() => res.redirect('/'))
    .catch(err => {
      console.log(err)
      res.render('error', { error: err.message })
    })
})

app.put('/restaurants/:id', (req, res) => {
  const id = req.params.id
  const restaurantParams = req.body
  console.log(req.body)
  Restaurant.findById(id)
    .then(restaurant => {

      restaurant.name = restaurantParams.name
      restaurant.name_en = restaurantParams.name_en
      restaurant.category = restaurantParams.category
      restaurant.image = restaurantParams.image
      restaurant.location = restaurantParams.location
      restaurant.phone = restaurantParams.phone
      restaurant.google_map = restaurantParams.google_map
      restaurant.rating = restaurantParams.rating
      restaurant.description = restaurantParams.description

      restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(err => {
      console.log(err)
      res.render('error', { error: err.message })
    })
})

//listen on server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})