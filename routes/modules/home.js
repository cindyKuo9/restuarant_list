const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')


router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(err => {
      console.log(err)
      res.render('error', { error: err.message })
    })
})

module.exports = router