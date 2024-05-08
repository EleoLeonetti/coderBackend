const { productModel } = require('../../daos/Mongo/models/products.model.js')

class ProductViewController {
    constructor(){
        this.model = productModel
    }
    
    getProducts = async (req, res) => {
        const { page = 1, limit = 10, category, sort } = req.query
        const filter = {}
        const sortOptions = {}

        if (category) filter.category = category

        if (sort === 'category') sortOptions.category = 1
        if (sort === 'price') sortOptions.price = 1

        try {
            const result = await this.model.paginate(filter, { page, limit, sort: sortOptions, lean: true })
            const categories = await this.model.distinct('category')

            result.docs.forEach(product => {
                if (product.thumbnails.startsWith('src\\public\\images\\')) {
                    product.thumbnails = product.thumbnails.substring('src\\public\\images\\'.length)
                }
            })

            res.render('products', {
                products: result.docs,
                categories,
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage,
                nextPage: result.nextPage,
                prevPage: result.prevPage,
                limit: result.limit
            })
        } catch (error) {
            res.send({ status: 'error', message: error.message })
        }
    }

    createProduct = async (req, res) => {
        res.render('createProduct')
    }
}

module.exports = ProductViewController
