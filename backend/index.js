const express = require('express')
const cosign = require('consign')

// instance express
const app = express()
app.use(express.json())

// initialize BD
require('./config/mongo')
const db = require('./config/postgres')
app.db = db


cosign()
.then('./config/middlewares.js')
.then('./api')
.then('./config/routes.js')
.into(app)


app.listen(3000, console.log('server'))
