const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/search', (req, res) => {
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

router.get('/:id', (req, res) => {
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

router.get('/', (req, res) => {
  res.render('new')
})

router.get('/:id/edit', (req, res) => {
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
router.post('/', (req, res) => {
  Restaurant.create(req.body)
    .then(() => { res.redirect('/') })
    .catch(err => {
      console.log(err)
      res.render('error', { error: err.message })
    })
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  Restaurant.findById(id)
    .then(restaurant => { restaurant.remove() })
    .then(() => res.redirect('/'))
    .catch(err => {
      console.log(err)
      res.render('error', { error: err.message })
    })
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  const restaurantParams = req.body
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

module.exports = router