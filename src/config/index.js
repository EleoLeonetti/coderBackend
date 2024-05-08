const dotenv             = require('dotenv')
const { program }        = require('../utils/commander.js')
const { connect }        = require('mongoose')
const { MongoSingleton } = require('../utils/mongoSingleton.js')

const { mode } = program.opts()
dotenv.config({
    path: mode === 'production' ? './.env.production' : './.env.development'
})

const configObject = {
    PORT: process.env.PORT,
    mongo_url: process.env.MONGO_URL,
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
    COOKIE_SECRET: process.env.COOKIE_SECRET
}

const connectDb = async() => {
    MongoSingleton.getInstance(process.env.MONGO_URL)
}

module.exports = {
    configObject,
    connectDb
}
