const cors = require("cors")

const whitelist = ["http://localhost:5000", "https://jinsokuna.herokuapp.com", "http://localhost:3000"] // CORSIP

const corsOptions = {
  origin: (origin, cb) => {
    const originIsWhitelisted = whitelist.includes(origin)
    cb(null, originIsWhitelisted)
  },
  credentials: true,
}

module.exports = (app) => app.use(cors(corsOptions))
