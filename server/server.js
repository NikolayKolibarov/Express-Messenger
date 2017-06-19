const express = require('express')
const app = express()
const env = process.env.NODE_ENV || 'development'

let config = require('./config/config')[env]

require('./config/database')(config)
require('./config/express')(config, app)
require('./config/routes')(app)
require('./config/passport')()
require('./config/seeder')()

app.listen(config.port, () => {
  console.log(`Listening on port ${config.port}`)
})
