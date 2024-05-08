const { Router } = require('express')
const ProductsViewController = require('../controllers/views/productsView.controller')
const SessionsViewController = require('../controllers/views/sessionsView.controller')
const UsersViewController    = require('../controllers/views/usersView.controller')
const { passportCall }       = require('../passport-jwt/passportCall.middleware')
const { authorization }      = require('../passport-jwt/authorization.middleware')

const router = Router()

const productsViews = new ProductsViewController()
const sessionsViews = new SessionsViewController()
const usersViews = new UsersViewController()

router
    .get('/products', productsViews.getProducts)
    .get('/register', sessionsViews.register)
    .get('/login', sessionsViews.login)
    .get('/uploadDocs/:uid',   usersViews.upload)
    .get('/createProduct',   productsViews.createProduct)
    .get('/premium/:uid',   usersViews.handleRole)
    
module.exports = router