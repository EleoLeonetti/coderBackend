const {Schema, model}  = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

const usersCollection = 'users'

const UserSchema = Schema({
    first_name: {
        type: String,
        require: [true, 'First name is required']
    },
    last_name: {
        type: String,
        require: [true, 'Last name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    birthdate: {
        type: Date,
        require: [true, 'Birthdate is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 8    
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    },
    role: {
        type: String,
        enum: ['PUBLIC','USER', 'USER_PREMIUM', 'ADMIN'],
        default: 'USER'
    },
    documents: {
        type: [{
            documentType: {
                type: String,
                required: true
            },
            path: {
                type: String,
                required: true
            }
        }]
    },
    last_connection: {
        type: Date
    },
    userStatus: {
        type: String,
        default: false,
        enum: ['REGULAR','PENDING', 'APPROVED'],
        default: 'REGULAR'
    }
})

UserSchema.pre('find', function(){
    this.populate('cart')
})


UserSchema.plugin(mongoosePaginate)

const userModel = model(usersCollection, UserSchema)

module.exports = {
    userModel
}