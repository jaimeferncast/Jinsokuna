require('dotenv').config()

// DB connection
require('./config/db.config')

// Debug
require('./config/debug.config')

// App
const express = require('express')
const app = express()

// App settings
require('./config/middleware.config')(app)
require('./config/locals.config')(app)
require('./config/cors.config')(app)
require('./config/passport.config')(app)

// Routes index
require('./routes')(app)

// Error handling - disable if deploy method is creating a build of the react app and saving it in the public folder
// require('./config/error-handlers.config')(app)

// send the .html created in the react app build to the client
app.use((req, res) => res.sendFile(__dirname + "/public/index.html"))

app.listen(process.env.PORT || 5000, () => {
  console.log('Port activated')
})