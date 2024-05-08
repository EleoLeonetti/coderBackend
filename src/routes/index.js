const { Router }     = require('express')
const productsRouter = require('./products.router.js')
const cartsRouter = require('./carts.router.js')
const usersRouter = require('./users.router.js')
const sessionsRouter = require('./sessions.router.js')
const viewsRouter = require('./views.router.js')
const ticketsRouter = require('./tickets.router.js')
const router = Router()

router.use('/api/products', productsRouter)
router.use('/api/carts',    cartsRouter)
router.use('/api/users',    usersRouter)
router.use('/api/sessions',    sessionsRouter)
router.use('/api/tickets',    ticketsRouter)
router.use('/views',    viewsRouter)

router.use((err, req, res, next) =>{
    console.log(err)
    res.status(500).send(`Error Server ${err}`)
})

module.exports = router
