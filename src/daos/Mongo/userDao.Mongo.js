const { userModel } = require("./models/users.model.js")

class userDaoMongo {
    constructor(){
        this.model = userModel
    }

    get    = async ({ page = 1, limit = 10}) => this.model.paginate({}, { page, limit })
    getBy  = async filter => this.model.findOne(filter)
    create = async newUser => this.model.create(newUser)
    update = async (uid, userToUpdate) => this.model.findByIdAndUpdate({_id:uid}, userToUpdate, {new: true})
    delete = async (uid) => this.model.findByIdAndDelete({_id:uid}, {new: true})
}

module.exports = userDaoMongo