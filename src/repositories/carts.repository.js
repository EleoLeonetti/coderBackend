class CartRepository {
    constructor(dao){
        this.dao = dao
    }

    async getCarts() {
        return await this.dao.get()
    }

    async getCart(filter) {
        return await this.dao.getBy(filter)
    }

    async createCart(newCart) {
        return await this.dao.create(newCart)
    }

    async updateCart(cid, product) {
        return await this.dao.update(cid, product)
    }

    async deleteProduct(pid){
        return await this.dao.deleteProduct(pid)
    }

    async deleteCart(cid) {
        return await this.dao.delete(cid)
    }

}

module.exports = CartRepository