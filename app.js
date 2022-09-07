const express = require("express")
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

require('./config/mongoose')
const Restaurant = require('./models/restaurant')
const routes = require('./routes')

const app = express()
// set template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(routes)

// set server related variable
const port = 3000


//listen on server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})