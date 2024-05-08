const { connect } = require('mongoose')

class MongoSingleton {
    static instance
    constructor (url){
        connect(url)
    }
    static getInstance (url){
        if(this.instance){
            console.log('Database already connected')
            return this.instance
        }
        this.instance = new MongoSingleton(url)
        console.log('Database connected')
        return this.instance
    }
}

module.exports = {
    MongoSingleton
}