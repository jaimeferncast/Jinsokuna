const cors = require("cors")

const whitelist = [process.env.DOMAIN, "http://192.168.0.107:3000"] // CORSIP

const corsOptions = {
  origin: (origin, cb) => {
    const originIsWhitelisted = whitelist.includes(origin)
    cb(null, originIsWhitelisted)
  },
  credentials: true,
}

module.exports = (app) => app.use(cors(corsOptions))
