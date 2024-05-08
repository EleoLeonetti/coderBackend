const { productService } = require("../repositories")

class ProductController {
    constructor() {
        this.service = productService
    }

    getProducts = async (req, res) => {
        const { page, limit, title, category, sort, numPage } = req.query
        const filter = {}
        if (title) filter.title = { $regex: title, $options: 'i' }
        if (category) filter.category = category

        const sortOptions = {}
        if (sort === 'price') sortOptions.price = 1
        if (sort === 'alphabetic') sortOptions.title = 1

        try {
            const result = await this.service.getProducts({ page:numPage, limit, filter, sort: sortOptions })
            if (!result.docs.length) {
                return res.send({ message: 'Products not found' })
            }
            res.send({ status: 'success', payload: result })
        } catch (error) {
            res.send({ status: 'error', message: error.message })
        }
    }

    getProduct = async (req, res) => {
        const { pid } = req.params
        try {
            const result = await this.service.getProduct({_id: pid})
            if(!result){
                return res.send({status: 'error', message: 'Product not found'})  
            }
            res.send({status: 'succes', payload: result})
        } catch (error) {
            res.send({status: 'error', message: error.message})
        }
    }

    createProduct = async (req, res) => {
        const newProduct = req.body
        const responsable = req.user
        try {
            
            if (!responsable) {
                return res.status(401).send({ status: 'error', message: 'User not authenticated' });
            }
            if (req.file) {
                // Agrega la ruta del archivo cargado al objeto del producto
                newProduct.thumbnails = req.file.path;
            }  else {
                
                return res.status(400).send({ status: 'error', message: 'Image is required' });
            }

            newProduct.owner = responsable.email
            const result = await this.service.createProduct(newProduct)
           
            res.send({status: 'Product created succesfully', payload: result})
            
        } catch (error) {
            res.send({status: 'error', message: error.message}) 
        }
        }

        updateProduct = async (req, res) => {
            const { pid } = req.params
            const productToUpdate = req.body
            try {
                if (productToUpdate.stock === 0) {
                    productToUpdate.isAvailable = false
                }

                const result = await this.service.updateProduct(pid, productToUpdate)
                if(!result){
                    return res.send({status: 'error', message: 'Product not found'})
                }
               
                res.send({status: 'Product updated succesfully', payload: result})
                
            } catch (error) {
                res.send({status: 'error', message: error.message}) 
            }
        }

        deleteProduct = async (req, res) => {
            const { pid } = req.params
            try {
                const result = await this.service.deleteProduct(pid)
                if (!result) {
                    return res.status(404).json({status: 'error', message: 'Product not found'})
                }
                res.send({status: 'Product deleted succesfully'})
            } catch (error) {
                res.send({status: 'error', message: error.message}) 
            }
        }
    }

module.exports = ProductController
