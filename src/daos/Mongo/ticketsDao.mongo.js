const { ticketModel } = require("./models/tickets.model");

class ticketDaoMongo {
    constructor(){
        this.model = ticketModel
    }

    get    = async () => this.model.find({})
    getBy  = async filter => this.model.findOne(filter)
    create = async newTicket => this.model.create(newTicket)
    update = async (tid, ticketToUpdate) => this.model.findByIdAndUpdate({_id:tid}, ticketToUpdate, {new: true})
    delete = async (tid) => this.model. findByIdAndDelete({_id: tid}, {new: true})
}

module.exports = ticketDaoMongo