const { Router }        = require('express')
const SessionController = require('../controllers/sessions.controller')

const router = Router()

const {
    register,
    login,
    logout
} = new SessionController()

router
    .post('/register', register)
    .post('/login', login)
    .post('/logout', logout)

module.exports = router