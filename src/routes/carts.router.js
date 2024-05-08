const { Router } = require('express')
const CartController = require('../controllers/carts.controller')
const { passportCall } = require('../passport-jwt/passportCall.middleware')
const { authorization } = require('../passport-jwt/authorization.middleware')

const router = Router()

const {
    getCarts,
    getCart,
    createCart,
    addProduct,
    deleteProduct,
    clearCart,
    purchase,
    handleQuantity
} = new CartController()

router
    .get('/', [passportCall('jwt'), authorization(['ADMIN'])], getCarts)
    .get('/:cid', [passportCall('jwt'), authorization(['USER', 'USER_PREMIUM'])], getCart)
    .post('/', [passportCall('jwt'), authorization(['USER', 'USER_PREMIUM'])], createCart)
    .post('/:cid/product/:pid', [passportCall('jwt'), authorization(['USER', 'USER_PREMIUM'])], addProduct)
    .delete('/:cid/product/:pid', [passportCall('jwt'), authorization(['USER', 'USER_PREMIUM'])], deleteProduct)
    .delete('/:cid', [passportCall('jwt'), authorization(['USER', 'USER_PREMIUM'])], clearCart)
    .post('/:cid/purchase', [passportCall('jwt'), authorization(['USER', 'USER_PREMIUM'])], purchase)
    .put('/:cid/productQuantity', handleQuantity)

module.exports = router
