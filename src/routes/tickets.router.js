const { Router }       = require('express')
const TicketController = require('../controllers/tickets.controller')

const router = Router()

const {
    getTickets,
    getTicket,
    createTicket
} = new TicketController()

router
    .get('/', getTickets)
    .get('/:tid', getTicket)
    .post('/', createTicket)

module.exports = router