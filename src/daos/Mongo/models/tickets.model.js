const { Schema, model } = require('mongoose')

const ticketSchema = new Schema({
    
    code: {
        type: String,
        require: true,
        unique: true
    },
    purchase_datetime: {
        type: Date,
        require: true,
        default: Date.now
    },
    amount: {
        type: Number,
        require: true
    }, 
    purchaser: {
        type: String
    }
})


const ticketModel = model('tickets', ticketSchema)

module.exports = { ticketModel }