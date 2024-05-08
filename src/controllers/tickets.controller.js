const { v4: uuidv4 }     = require('uuid')
const { ticketsService } = require("../repositories")

class TicketController {
    constructor(){
        this.service = ticketsService
    }

    getTickets = async(req,res) => {
        try {
            const tickets = await this.service.getTickets()

            tickets
            ? res.send({status:"success", payload: tickets}) 
            : res.status(501).send({status:"Error", message:"No tickets found"})
        } catch (error) {
            res.status(500).send({status: 'error', message: error.message})
        }
    }

    getTicket = async(req,res) => {
        try {
            const {tid} = req.params
            const ticket = await this.service.getTicket(tid)
    
            ticket 
            ? res.status(200).send({status:"success", toTicketIs: ticket}) 
            : res.status(404).send({status:"Error", message:"Your ticket does not exist"})
        } catch (error) {
            res.status(500).send({status: 'error', message: error.message})
        }
    }

    createTicket = async (req, res) => {

        try {
            const code = uuidv4()
            const { amount, purchaser } = req.body

            const newTicket = {
                code,
                amount,
                purchaser
            }

            const result = await this.service.createTicket(newTicket)

            res.status(201).send({ status: "Success", message: "Ticket created", ticket: result })

        } catch (error) {
            res.status(500).send({ status: "Error", message: error.message })
        }
    }
}

module.exports = TicketController