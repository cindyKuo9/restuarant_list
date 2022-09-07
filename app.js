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

const routes = require('./routes')

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
app.use(routes)


//listen on server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})