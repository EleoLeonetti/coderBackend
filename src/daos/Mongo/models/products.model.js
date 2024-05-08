const { Schema, model } = require('mongoose')
const mongoosePaginate  = require('mongoose-paginate-v2')

const productSchema = new Schema ({
    title: {
        type: String,
        required: [true, 'Title is required'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    code: {
        type: String,
        required: [true, 'Code is required'],
        unique: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    stock: {
        type: Number,
        required: [true, 'Stock is required'],
        min: 0
    },
    category: {
        type: String,
        required: [true, 'Category is required']
    },
    thumbnails: {
        type: String,
        required: [true, 'Image is required'],
        unique: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    owner: {
        type: String
    }
})
productSchema.pre('save', function(next) {
    if(this.stock === 0) {
        this.isAvailable = false
    }
    next()
})
productSchema.plugin(mongoosePaginate)

const productModel = model('products', productSchema)

module.exports = {
    productModel
}