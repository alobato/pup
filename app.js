const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

const routes = require('./routes')

const app = express()

// app.use(cors())

app.use(cors({
  origin: (origin, callback) => {
    return callback(null, true)
  },
  optionsSuccessStatus: 200,
  credentials: true
}))

app.use(morgan('combined'))

app.use(bodyParser.json({limit: '50mb'}))

Object.keys(routes).forEach(key => {
  app.use(`/${key}`, routes[key])
})

app.use(express.static('public'))

app.listen(8000)
