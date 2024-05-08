const { cartModel } = require("./models/carts.model.js")

class cartDaoMongo {
    constructor () {
        this.model = cartModel
    }

    get    = async () => this.model.find({})
    getBy  = async filter => this.model.findOne(filter).populate('products.product')
    create = async newCart => this.model.create(newCart)
    update = async (cid, product) => this.model.findByIdAndUpdate({ _id: cid }, { $push: { products: product } }, { new: true }).populate('products.product')
    deleteProduct = async (pid) => this.model.updateOne({ 'products._id': pid },{ $pull: { products: { _id: pid } } })
    delete = async (cid) => this.model. findByIdAndDelete({_id: cid}, {new: true})
}

module.exports = cartDaoMongo
