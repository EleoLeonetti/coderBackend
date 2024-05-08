class TicketRepository {
    constructor(dao){
        this.dao = dao
    }

    async getTickets() {
        return await this.dao.get()
    }

    async getTicket(filter) {
        return await this.dao.getBy(filter)
    }

    async createTicket(newTicket) {
        return await this.dao.create(newTicket)
    }

    async updateTicket(tid, ticket) {
        return await this.dao.update(tid, ticket)
    }

    async deleteTicket(pid){
        return await this.dao.delete(tid)
    }

}

module.exports = TicketRepository