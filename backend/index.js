const express = require('express')
const cosign = require('consign')

// instance express
const app = express()

// initialize BD
const mongoose = require('./config/mongo')
const db = require('./config/postgres')


app.db = db
app.mongoose = mongoose


cosign()
.include('./config/passport.js')
.then('./config/middlewares.js')
.then('./api/validation.js')
.then('./api')
.then('./config/routes.js')
.into(app)


app.listen(3000, console.log('server'))
