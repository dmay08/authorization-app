// Main starting point of the application
const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
const router = require('./router')
const mongoose = require('mongoose') // add AFTER installing 'mongodb'

// DB Setup (add AFTER installing 'mongodb') - tells Mongoose to connect to our instance of MongoDB

// mongoose.connect('mongodb://localhost:auth/auth', { useNewUrlParser: true }) // last 'auth' can be named whatever I want
mongoose.connect('mongodb://localhost:27018/auth', { useNewUrlParser: true }) // last 'auth' can be named whatever I want

// App Setup
app.use(morgan('combined'))                // app.use() >> sets up: middleware; morgan = 'login framework'
app.use(bodyParser.json({ type: '*/*' }))  // app.use() >> sets up: middleware; parses incoming requests into JSON
router(app)

// Server Setup
const port = process.env.PORT || 3090
const server = http.createServer(app)
server.listen(port)
console.log('Server listening on:', port)