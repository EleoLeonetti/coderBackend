const { cartService, productService, ticketsService } = require("../repositories")
const { v4: uuidv4 } = require('uuid')

class CartController {
    constructor () {
        this.service = cartService
        this.productService = productService
        this.ticketService = ticketsService
    }

    getCarts = async (req, res) => {

        try {
            const carts = await this.service.getCarts()
            if(!carts){
                return res.send({status: 'error', message: 'No carts found'}) 
            }
            res.send({status: 'success', payload: carts})

        } catch (error) {
            res.send({status: 'error', message: error.message})
        }
    }

    getCart = async (req, res) =>{
        const {cid} = req.params

        try {
            const cart = await this.service.getCart({_id: cid})
            if(!cart){
                return res.send({status: 'error', message: 'Cart not found'})
            }
            res.send({status: 'succes', payload: cart})

        } catch (error) {
            res.send({status: 'error', message: error.message})
        }
    }

    createCart = async (req, res) => {

        if (!req.user) {
            return res.status(401).send({ status: 'error', message: 'User not unauthenticated ' })
        }

        if (req.user.role.toUpperCase() === 'ADMIN') {
            return res.status(403).send({ status: 'error', message: 'Not authorize' })
        }
        
        const newCart = {
            user: req.user._id,
            products: req.body.products
        }
    
        try {
            const result = await this.service.createCart(newCart)
            res.send({ status: 'Cart created succesfully', payload: result })
        } catch (error) {
            res.status(500).send({ status: 'error', message: error.message })
        }
    }

    addProduct = async (req, res) => {

        try {
            let { cid, pid } = req.params
            const { quantity } = req.body
    
            const cart = await cartService.getCart({ _id: cid })
            const product = await productService.getProduct({ _id: pid })

            if (cart.products.some(product => product._id.equals(pid))) {
                return res.status(400).send({ status: "Error", message: "Product already in cart" })
            }
            
            if (product.owner === req.user.email) {
                return res.status(403).send({ status: "Error", message: "Cannot buy this product" })
            }
    
            if (product.stock < 1) {
                return res.status(404).send({ status: "Error", message: "Out of stock" })
            }
    
            await this.service.updateCart(cid, product, quantity)

            res.status(200).send({ 
                status: "Succes", 
                message: `Product ${product.title} was added to cart`
            })
            
        } catch (error) {
            res.status(500).send({ status: "Error", message: error.message })
        }
    }

    handleQuantity = async (req, res) => {
        try {
            const { cid } = req.params
            const { pid, quantityChange } = req.body

            const cart = await this.service.getCart({ _id: cid })
            if (!cart) {
                return res.status(404).send({ status: "Error", message: "Cart not found" })
            }

            const updatedProducts = cart.products.map(product => {
                if (product._id.equals(pid)) {
                    product.quantity = parseInt(quantityChange)
                    return product.quantity
                }
                return product.quantity
            })

            await cart.save()

            res.status(200).send({ status: "Success", message: "Quantity updated successfully" })
        } catch (error) {
            res.status(500).send({ status: "Error", message: error.message })
        }
    }
    
    deleteProduct = async (req, res) => {

        try {
            const { cid, pid } = req.params
            const cart = await cartService.getCart({ _id: cid })
            
            if (!cart) {
                return res.status(404).send({ status: "Error", message: "Cart not found" });
            }
    
            await this.service.deleteProduct(pid)
            
            res.status(200).send({ status: "Success", message: `Product ${pid} removed from cart` })

        } catch (error) {
            res.status(500).send({ status: "Error", message: error.message })
        }
    }
    
    clearCart = async (req, res) => {
        const { cid } = req.params
        
        try {
            const cart = await this.service.getCart({_id: cid})
            if(!cart){
                return res.send({status: 'error', message: 'Cart not found'})
            } 

            cart.products = []
            await cart.save()
            res.send({status: 'success', payload: cart})
        
        } catch (error) {
            res.status(500).send({message: error.message})
        }
    }

    purchase = async (req, res) => {

        try {
            const { cid }  = req.params
            const cart     = await this.service.getCart({ _id: cid })
            let outOfStock = []
            let onStock    = []

    
            if (!cart) {
                return res.status(404).send({ status: "Error", message: "Cart not found" })
            }

            const cartId = cart._id
    
            const productIds = cart.products.map(product => product._id.toString())
    
            const products = await Promise.all(productIds.map(async productId => {
                const product = await this.productService.getProduct({ _id: productId })
                if (!product) {
                    throw new Error(`Product with ID ${productId} not found`)
                }
                
                return {
                    _id: product._id,
                    stock: product.stock,
                    title: product.title,
                    price: product.price
                }
            }))
    
            const productsInCart = cart.products.map(product => {
                return {
                    product_id: product._id,
                    quantity: product.quantity
                }
            })
    
            productsInCart.forEach(async (productInCart, index) => {
                const newQuantity = req.body.products[index]?.quantity
                if (newQuantity !== undefined) {
                    cart.products[index].quantity = newQuantity
                }
            })

            await cart.save()

            productsInCart.forEach(product => {
                const productInfo = products.find(p => p._id.toString() === product.product_id.toString())
                if (!productInfo) {
                    return res.send({status: 'error', message: `Product ID ${product.product_id} not found in products list.`})
                }
                
                if (product.quantity > productInfo.stock) {
                    outOfStock.push(productInfo)
                } else {
                    onStock.push(productInfo)
                }
            })

            const totalsPerProduct = onStock.map(product => {
                const productInCart = productsInCart.find(p => p.product_id.toString() === product._id.toString())
                const quantityInCart = productInCart ? productInCart.quantity : 0
                const totalPerProduct = product.price * quantityInCart
            return {
                ...product,
                quantityInCart: quantityInCart,
                totalPerProduct: totalPerProduct
            }
        })

            const totalPurchase = totalsPerProduct.reduce((total, product) => {
                return total + product.totalPerProduct
            }, 0)

        for (const productInCart of cart.products) {
            const product = products.find(p => p._id.toString() === productInCart._id.toString())
                
            if (!product) {
                return res.send({status: 'error', message: `Product ID ${productInCart._id} not found in products list.` })
            }
        
            const newStock = product.stock - productInCart.quantity
    
            await this.productService.updateProduct(product._id, { stock: newStock })
        }

        const ticket = await this.ticketService.createTicket({
            code: uuidv4(),
            amount: totalPurchase, 
            purchaser: req.user.email
        })
    
        if (!ticket) {
            return res.send({status: 'error', message: 'Failed to create ticket'})
        }
    
        res.send({ status: 'success', ticket: ticket })

        cart.products = []
            await cart.save()
            
        } catch (error) {
            res.status(500).send({ status: "Error", message: error.message })
        }
    }
    
}

module.exports = CartController

