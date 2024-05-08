const jwt = require('jsonwebtoken')
const { configObject } = require('../config')

const JWT_PRIVATE_KEY = configObject.JWT_PRIVATE_KEY

const createToken = user => jwt.sign(user, JWT_PRIVATE_KEY, {expiresIn: '1d'})

module.exports = {
    createToken,
    JWT_PRIVATE_KEY
}