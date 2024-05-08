const { Router } = require('express')
const ProductController = require('../controllers/products.controller')
const { passportCall } = require('../passport-jwt/passportCall.middleware')
const { authorization } = require('../passport-jwt/authorization.middleware')
const { uploader } = require('../utils/uploader')

const router = Router()

const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} = new ProductController()

router
    .get('/', getProducts)
    .get('/:pid', getProduct)
    .post('/', uploader.single('images'), [passportCall('jwt'), authorization(['ADMIN', 'USER_PREMIUM'])],  createProduct)
    .put('/:pid', [passportCall('jwt'), authorization(['ADMIN'])], updateProduct)
    .delete('/:pid', [passportCall('jwt'), authorization(['ADMIN'])],  deleteProduct)


module.exports = router