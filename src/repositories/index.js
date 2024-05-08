const productDaoMongo   = require("../daos/Mongo/productsDao.mongo.js")
const ProductRepository = require("./products.repository.js")
const cartDaoMongo      = require("../daos/Mongo/cartsDao.mongo.js")
const CartRepository    = require("./carts.repository.js")
const UserRepository = require("./users.repository.js")
const userDaoMongo = require("../daos/Mongo/userDao.Mongo.js")
const ticketDaoMongo = require("../daos/Mongo/ticketsDao.mongo.js")
const TicketRepository = require("./tickets.repository.js")



const productService = new ProductRepository(new productDaoMongo)
const cartService    = new CartRepository(new cartDaoMongo)
const userService    = new UserRepository(new userDaoMongo)
const ticketsService = new TicketRepository(new ticketDaoMongo)


module.exports = {
    productService,
    cartService,
    userService,
    ticketsService
}
